import { HexString } from "@polkadot-api/substrate-bindings"
import type {
  PinnedBlocks,
  BlockInfo,
  ChainHead$,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import {
  BlockNotPinnedError,
  isBestOrFinalizedBlock,
} from "@polkadot-api/observable-client"
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  pairwise,
  startWith,
  take,
  takeUntil,
  throwError,
  withLatestFrom,
} from "rxjs"
import { selfDependent, lossLessExhaustMap } from "@/utils"
import { state } from "@rx-state/core"

interface StorageEntry {
  key: HexString
  value: HexString
  dec: {
    args: Array<any>
    value: any
  }
}

type Deltas = {
  upserted: Array<StorageEntry>
  deleted: Array<StorageEntry>
}

interface MemoryBlock {
  prev: HexString | null
  block: BlockInfo
  rootHash: string
  entries: Array<StorageEntry>
  deltas: Deltas | null
  patcher: (input: StorageEntry) => StorageEntry
}

type MemoryBlocks = {
  blocks: Record<HexString, MemoryBlock>
  finalized: HexString
}

const getDiff = (
  _prev: Array<StorageEntry>,
  _current: Array<StorageEntry>,
  patch: (input: StorageEntry) => StorageEntry,
): Pick<MemoryBlock, "entries" | "deltas"> => {
  const current = new Map(_current.map((x) => [x.key, x]))
  const prev = new Map(_prev.map((x) => [x.key, x]))

  const upserted: Map<string, StorageEntry> = new Map()
  const deleted: Array<StorageEntry> = []

  _current.forEach((value) => {
    const { key } = value
    const prevVal = prev.get(key)
    if (!prevVal || prevVal.value !== value.value)
      upserted.set(key, patch(value))
  })

  _prev.forEach((x) => {
    if (!current.has(x.key)) deleted.push(x)
  })

  return {
    deltas: {
      deleted,
      upserted: [...upserted.values()],
    },
    entries: _current.map(({ key }) => upserted.get(key) ?? prev.get(key)!),
  }
}

const findPrevious = (
  start: HexString,
  state: MemoryBlocks["blocks"],
  pinned: PinnedBlocks,
  includeStart = false,
) => {
  try {
    let target = includeStart ? start : pinned.blocks.get(start)!.parent
    while (target && !state[target]) target = pinned.blocks.get(target)!.parent!

    if (!target) return null
    return state[target]
  } catch {
    return null
  }
}

const getPatcherFromRuntime =
  (pallet: string, entry: string) => (runtime: RuntimeContext) => {
    const { keys, value } = runtime.dynamicBuilder.buildStorage(pallet, entry)
    return (x: StorageEntry) => {
      x.dec = {
        value: value.dec(x.value),
        args: keys.dec(x.key),
      }
      return x
    }
  }

export const createWatchEntries = (
  blocks$: Observable<PinnedBlocks>,
  storage: ChainHead$["storage$"],
  withRuntime: ChainHead$["withRuntime"],
) => {
  const getMemoryBlocks$ = state(
    (pallet: string, entry: string, storageKey: string) => {
      const getPatcher = getPatcherFromRuntime(pallet, entry)
      const getNextMemoryBlock$ = (
        prev: MemoryBlock | null,
        block: BlockInfo,
      ): Observable<MemoryBlock> => {
        const isNotCanonical$ = isBestOrFinalizedBlock(
          blocks$,
          block.hash,
        ).pipe(
          filter((x) => !x),
          take(1),
        )

        return storage(
          block.hash,
          "closestDescendantMerkleValue",
          () => storageKey,
        ).pipe(
          mergeMap((merkleValueResult) => {
            const rootHash = merkleValueResult.value!
            if (rootHash === prev?.rootHash)
              return of({
                ...prev,
                block,
                deltas: null,
                prev: prev.block.hash,
              })

            return storage(
              block.hash,
              "descendantsValues",
              () => storageKey,
            ).pipe(
              withRuntime(() => block.hash),
              map(
                ([entriesResult, runtimeCtx]) =>
                  [entriesResult.value, getPatcher(runtimeCtx)] as const,
              ),
              map(
                ([entries, patcher]): MemoryBlock => ({
                  prev: prev && prev.block.hash,
                  rootHash,
                  block,
                  patcher,
                  ...getDiff(
                    prev?.entries ?? [],
                    entries as StorageEntry[],
                    patcher,
                  ),
                }),
              ),
            )
          }),
          takeUntil(isNotCanonical$),
          catchError((e) =>
            e instanceof BlockNotPinnedError ? EMPTY : throwError(() => e),
          ),
        )
      }

      const initial$ = blocks$.pipe(
        distinctUntilChanged((a, b) => a.finalized === b.finalized),
        lossLessExhaustMap(({ blocks, finalized }) =>
          getNextMemoryBlock$(null, blocks.get(finalized)!),
        ),
        take(1),
        map(
          (x): MemoryBlocks => ({
            blocks: { [x.block.hash]: x },
            finalized: x.block.hash,
          }),
        ),
      )

      const [_memoryBlocks$, connectMemoryBlocks] =
        selfDependent<MemoryBlocks>()

      const updates$ = blocks$.pipe(
        distinctUntilChanged((a, b) => a.best === b.best),
        withLatestFrom(_memoryBlocks$),
        lossLessExhaustMap(([pinned, memoryBlocks]) => {
          const { best } = pinned
          const { blocks } = memoryBlocks
          let target = !blocks[best] ? best : null
          if (!target) return EMPTY

          const previous = findPrevious(target, blocks, pinned)
          if (previous)
            return getNextMemoryBlock$(
              previous,
              pinned.blocks.get(target)!,
            ).pipe(
              map((x) => {
                blocks[target!] = x
                return memoryBlocks
              }),
            )

          // This means that there has been a stop event that the pinned-blocks
          // couldn't recover from. Therefore, we must "start over"
          target = pinned.finalized
          return getNextMemoryBlock$(
            blocks[memoryBlocks.finalized],
            pinned.blocks.get(target)!,
          ).pipe(
            map((x) => {
              x.prev = null
              return {
                blocks: { [target]: x },
                finalized: target,
              }
            }),
          )
        }),
      )

      return merge(initial$, updates$).pipe(connectMemoryBlocks())
    },
  )

  const getBestOrFinalized =
    (isFinalized: boolean) =>
    (pallet: string, entry: string, storageKey: string) => {
      const memoryBlocks$ = getMemoryBlocks$(pallet, entry, storageKey)

      const prop = isFinalized ? "finalized" : "best"

      return combineLatest([
        memoryBlocks$,
        blocks$.pipe(distinctUntilChanged((a, b) => a[prop] === b[prop])),
      ]).pipe(
        map(([state, blocks]) => {
          const update = findPrevious(blocks[prop], state.blocks, blocks, true)
          return update && { update, state }
        }),
        filter(Boolean),
        distinctUntilChanged((a, b) => a.update === b.update),
        startWith(null),
        pairwise(),
        mergeMap(([prev, next]) => {
          if (!prev) return [next!.update]
          const { update: prevUpdate } = prev

          const { state: memoryBlocks, update: latest } = next!
          let ancestor: MemoryBlock | null = latest
          const updates: Array<MemoryBlock> = []
          while (ancestor && ancestor.block.number > prevUpdate.block.number) {
            updates.unshift(ancestor)
            ancestor = ancestor.prev ? memoryBlocks.blocks[ancestor.prev] : null
          }

          if (isFinalized) {
            memoryBlocks.finalized = latest.block.hash
            if (updates.length) {
              const { blocks } = memoryBlocks
              Object.keys(blocks).forEach((key) => {
                if (blocks[key].block.number < updates[0].block.number)
                  delete blocks[key]
              })
            }
          }

          if (prevUpdate === ancestor) return updates

          // It's a re-org
          return [
            {
              ...latest,
              ...(prevUpdate.rootHash === latest.rootHash
                ? {
                    entries: prevUpdate.entries,
                    deltas: null,
                  }
                : getDiff(prevUpdate.entries, latest.entries, latest.patcher)),
            },
          ]
        }),
      )
    }

  const getFinalized$ = state(getBestOrFinalized(true))
  const getBest$ = state(getBestOrFinalized(false))

  return (pallet: string, entry: string, args: Array<any>, atBest: boolean) => {
    const fn = atBest ? getBest$ : getFinalized$
    const storageKey$ = blocks$.pipe(
      take(1),
      mergeMap(
        (b) =>
          b.runtimes[b.blocks.get(b[atBest ? "best" : "finalized"])!.runtime]
            .runtime,
      ),
      map((runtime) =>
        runtime.dynamicBuilder.buildStorage(pallet, entry).keys.enc(...args),
      ),
    )
    return storageKey$.pipe(
      take(1),
      mergeMap((storageKey) => fn(pallet, entry, storageKey)),
      map(({ block: { hash, number, parent }, deltas, entries }, idx) => {
        const actualDeltas =
          idx > 0 ? deltas : { deleted: [], upserted: entries }

        return {
          block: { hash, number, parent },
          entries: entries.map(toDec),
          deltas: actualDeltas && {
            deleted: actualDeltas.deleted.map(toDec),
            upserted: actualDeltas.upserted.map(toDec),
          },
        }
      }),
    )
  }
}

const toDec = <T>(x: { dec: T }): T => x.dec
