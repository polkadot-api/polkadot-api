import { shareLatest } from "@/utils"
import {
  Observable,
  Observer,
  Subject,
  exhaustMap,
  map,
  merge,
  scan,
  tap,
  timer,
} from "rxjs"
import { withStopRecovery } from "../enhancers"
import type { FollowEvent } from "./follow"
import { Runtime, getRuntimeCreator } from "./get-runtime-creator"
import { BlockInfo } from "../chainHead"
import {
  PinnedBlock,
  PinnedBlocks,
  PinnedBlockState,
} from "./pinned-blocks-types"

export interface BlockUsageEvent {
  type: "blockUsage"
  value: { type: "hold"; hash: string } | { type: "release"; hash: string }
}
interface CleanupEvent {
  type: "cleanup"
}

export const toBlockInfo = ({
  hash,
  number,
  parent,
  hasNewRuntime,
}: PinnedBlock): BlockInfo => ({
  hash,
  number,
  parent,
  hasNewRuntime,
})

export const getPinnedBlocks$ = (
  follow$: Observable<FollowEvent>,
  call$: (hash: string, method: string, args: string) => Observable<Uint8Array>,
  getCachedMetadata$: (codeHash: string) => Observable<Uint8Array | null>,
  setCachedMetadata: (codeHash: string, metadataRaw: Uint8Array) => void,
  blockUsage$: Subject<BlockUsageEvent>,
  newBlocks$: Observer<BlockInfo | null>,
  onUnpin: (blocks: string[]) => void,
  deleteFromCache: (block: string) => void,
) => {
  const deleteBlocks = (
    { blocks, runtimes }: PinnedBlocks,
    toDelete: string[],
  ) => {
    toDelete.forEach((blockHash) => {
      blocks.get(blocks.get(blockHash)!.parent)?.children.delete(blockHash)
      blocks.delete(blockHash)
      deleteFromCache(blockHash)
    })

    Object.entries(runtimes)
      .map(([key, value]) => ({
        key,
        usages: value.deleteBlocks(toDelete),
      }))
      .filter((x) => x.usages === 0)
      .map((x) => x.key)
      .forEach((unusedRuntime) => {
        delete runtimes[unusedRuntime]
      })
  }

  const onNewBlock = (block: PinnedBlock) => {
    newBlocks$.next(toBlockInfo(block))
  }

  const setToReady = (acc: PinnedBlocks) => {
    deleteBlocks(
      acc,
      [...acc.blocks.values()].filter((b) => b.recovering).map((b) => b.hash),
    )

    const pendingBlocks =
      "pendingBlocks" in acc.state ? acc.state.pendingBlocks : []
    acc.state = { type: PinnedBlockState.Ready }
    pendingBlocks.forEach(onNewBlock)
  }

  const cleanup$ = new Subject<void>()
  const cleanupEvt$ = cleanup$.pipe(
    exhaustMap(() => timer(0)),
    map(
      (): CleanupEvent => ({
        type: "cleanup" as const,
      }),
    ),
  )

  const state: PinnedBlocks = getInitialPinnedBlocks()
  const resetState = () => {
    deleteBlocks(
      state,
      [...state.blocks.values()].map((b) => b.hash),
    )
    return Object.assign(state, getInitialPinnedBlocks())
  }
  const _pinnedBlocks$: Observable<PinnedBlocks> = merge(
    blockUsage$,
    cleanupEvt$,
    follow$,
  ).pipe(
    scan((acc, event) => {
      const unpinAndDelete = (toUnpin: string[]) => {
        deleteBlocks(acc, toUnpin)
        onUnpin(toUnpin)
      }

      const tryToUnpin = (...target: PinnedBlock[]) => {
        const finHeight = acc.blocks.get(acc.finalized)?.number ?? -1
        const toRemove = target
          .filter(
            ({ refCount, recovering, number, pruned }) =>
              !refCount && !recovering && (pruned || number < finHeight),
          )
          .map(({ hash }) => hash)
        toRemove.length && unpinAndDelete(toRemove)
      }

      switch (event.type) {
        case "initialized":
          if (
            acc.state.type !== PinnedBlockState.Initializing &&
            acc.state.type !== PinnedBlockState.RecoveringInit
          )
            throw new Error("Initialized event out of order")

          if (
            acc.state.type === PinnedBlockState.RecoveringInit &&
            !event.finalizedBlockHashes.some((hash) => acc.blocks.has(hash))
          ) {
            resetState()
            newBlocks$.next(null)
          }

          const latestFinalizedHeight =
            acc.blocks.get(acc.finalized)?.number ?? -1

          const lastIdx = event.finalizedBlockHashes.length - 1

          // We must take into account that the new subscription could be behind the previous one
          const pendingBlocks: Array<PinnedBlock> = []
          if (latestFinalizedHeight > event.number + lastIdx) {
            acc.state = {
              type: PinnedBlockState.RecoveringFin,
              target: latestFinalizedHeight,
              pendingBlocks,
            }
          } else {
            acc.state = {
              type: PinnedBlockState.Initializing,
              pendingBlocks,
            }
            acc.finalized = event.finalizedBlockHashes[lastIdx]
          }

          let latestRuntime = acc.finalizedRuntime.codeHash

          event.finalizedBlockHashes.forEach((hash, i) => {
            const preexistingBlock = acc.blocks.get(hash)

            if (preexistingBlock) {
              preexistingBlock.recovering = false
            } else {
              const number = event.number + i
              const isNew = number > latestFinalizedHeight

              const codeHash = event.runtimeChanges.get(hash)
              const requiresFromNewRuntime =
                codeHash && !acc.runtimes[codeHash] && isNew
              if (requiresFromNewRuntime) latestRuntime = codeHash
              const parent =
                i === 0 ? event.parentHash : event.finalizedBlockHashes[i - 1]

              const block = {
                hash: hash,
                hasNewRuntime: i
                  ? event.runtimeChanges.has(hash)
                  : event.hasNewRuntime,
                parent,
                children: new Set(
                  i === lastIdx ? [] : [event.finalizedBlockHashes[i + 1]],
                ),
                pruned: false,
                runtime: latestRuntime,
                refCount: 0,
                number,
                recovering: false,
              }
              acc.blocks.set(hash, block)
              // it must happen after setting the block
              if (requiresFromNewRuntime)
                acc.finalizedRuntime = acc.runtimes[codeHash] = getRuntime(
                  codeHash,
                  hash,
                )
              acc.runtimes[latestRuntime].usages.add(hash)
              if (isNew) pendingBlocks.push(block)
            }
          })
          return acc

        case "stop-error":
          if (acc.state.type === PinnedBlockState.Initializing)
            return resetState()

          for (const block of acc.blocks.values()) {
            block.recovering = true
          }
          acc.state = { type: PinnedBlockState.RecoveringInit }

          return acc

        case "newBlock": {
          const { parentBlockHash: parent, blockHash: hash } = event
          if (acc.blocks.has(hash)) {
            acc.blocks.get(hash)!.recovering = false
          } else {
            const parentNode = acc.blocks.get(parent)!
            parentNode.children.add(hash)
            const number = parentNode.number + 1
            const block = {
              hash,
              number,
              parent,
              children: new Set<string>(),
              runtime: parentNode.runtime,
              pruned: false,
              refCount: 0,
              recovering: false,
              hasNewRuntime: !!event.newRuntime,
            }
            acc.blocks.set(hash, block)
            if (event.newRuntime) {
              const { codeHash } = event
              block.runtime = codeHash!
              acc.runtimes[codeHash!] = getRuntime(codeHash!, hash)
            }

            acc.runtimes[block.runtime].addBlock(hash)
            if ("pendingBlocks" in acc.state)
              acc.state.pendingBlocks.push(block)
            else onNewBlock(block)
          }

          return acc
        }

        case "bestBlockChanged": {
          if (acc.state.type === PinnedBlockState.RecoveringFin) return acc
          acc.best = event.bestBlockHash
          if (acc.state.type === PinnedBlockState.Initializing) setToReady(acc)
          return acc
        }

        case "finalized": {
          const finalized = event.finalizedBlockHashes.slice(-1)[0]
          let shouldBeSetToReady = false
          if (acc.state.type === PinnedBlockState.RecoveringFin) {
            if (acc.blocks.get(finalized)!.number < acc.state.target) return acc
            shouldBeSetToReady = true
          }
          acc.finalized = finalized
          const { blocks } = acc

          // This logic is only needed because of a bug on some pretty old versions
          // of the polkadot-sdk node. However, fixing it with an enhancer
          // was a huge PITA. Therefore, it's more pragmatic to address it here
          if (blocks.get(acc.best)!.number < blocks.get(acc.finalized)!.number)
            acc.best = acc.finalized

          acc.finalizedRuntime =
            acc.runtimes[blocks.get(acc.finalized)!.runtime]

          event.prunedBlockHashes.forEach((hash) => {
            const block = acc.blocks.get(hash)
            if (block) block.pruned = true
          })

          if (shouldBeSetToReady) setToReady(acc)
          if (acc.state.type === PinnedBlockState.Ready) cleanup$.next()

          return acc
        }
        case "cleanup": {
          tryToUnpin(...acc.blocks.values())
          return acc
        }
        case "blockUsage": {
          const block = acc.blocks.get(event.value.hash)
          if (!block) return acc
          block.refCount += event.value.type === "hold" ? 1 : -1
          tryToUnpin(block)
          return acc
        }
      }
    }, state),
    map((x) => ({ ...x })),
    tap({
      error(e) {
        newBlocks$.error(e)
      },
    }),
    shareLatest,
  )

  const pinnedBlocks$ = Object.assign(_pinnedBlocks$, { state })

  const getRuntime = getRuntimeCreator(
    withStopRecovery(pinnedBlocks$, call$, "pinned-blocks"),
    getCachedMetadata$,
    setCachedMetadata,
  )

  return pinnedBlocks$
}

const getInitialPinnedBlocks = (): PinnedBlocks => ({
  best: "",
  finalized: "",
  runtimes: {},
  blocks: new Map(),
  finalizedRuntime: {} as Runtime,
  state: { type: PinnedBlockState.Initializing, pendingBlocks: [] },
})
