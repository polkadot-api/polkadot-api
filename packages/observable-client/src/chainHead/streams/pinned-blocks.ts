import { shareLatest } from "@/utils"
import {
  Observable,
  Observer,
  Subject,
  exhaustMap,
  filter,
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

export interface PinnedBlock {
  hash: string
  number: number
  parent: string
  children: Set<string>
  runtime: string
  unpinnable: boolean
  refCount: number
  recovering: boolean
  hasNewRuntime: boolean
}

export interface BlockUsageEvent {
  type: "blockUsage"
  value: { type: "hold"; hash: string } | { type: "release"; hash: string }
}
interface CleanupEvent {
  type: "cleanup"
}

export type PinnedBlocks = {
  best: string
  finalized: string
  runtimes: Record<string, Runtime>
  blocks: Map<string, PinnedBlock>
  finalizedRuntime: Runtime
  recovering: null | { type: "init" } | { type: "fin"; target: number }
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

const deleteBlock = (blocks: PinnedBlocks["blocks"], blockHash: string) => {
  blocks.get(blocks.get(blockHash)!.parent)?.children.delete(blockHash)
  blocks.delete(blockHash)
}

const deleteBlocks = (blocks: PinnedBlocks, toDelete: string[]) => {
  toDelete.forEach((hash) => {
    deleteBlock(blocks.blocks, hash)
  })

  Object.entries(blocks.runtimes)
    .map(([key, value]) => ({
      key,
      usages: value.deleteBlocks(toDelete),
    }))
    .filter((x) => x.usages === 0)
    .map((x) => x.key)
    .forEach((unusedRuntime) => {
      delete blocks.runtimes[unusedRuntime]
    })
}

export const getPinnedBlocks$ = (
  follow$: Observable<FollowEvent>,
  call$: (hash: string, method: string, args: string) => Observable<string>,
  getCachedMetadata$: (codeHash: string) => Observable<Uint8Array | null>,
  setCachedMetadata: (codeHash: string, metadataRaw: Uint8Array) => void,
  blockUsage$: Subject<BlockUsageEvent>,
  newBlocks$: Observer<BlockInfo | null>,
  onUnpin: (blocks: string[]) => void,
  deleteFromCache: (block: string) => void,
) => {
  const recover = (acc: PinnedBlocks) => {
    for (const [hash, block] of acc.blocks) {
      if (block.recovering) {
        deleteBlock(acc.blocks, hash)
        deleteFromCache(hash)
      }
    }
    acc.recovering = null
  }

  const onNewBlock = (block: PinnedBlock) => {
    newBlocks$.next(toBlockInfo(block))
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
  const pinnedBlocks$: Observable<PinnedBlocks> = merge(
    blockUsage$,
    cleanupEvt$,
    follow$,
  ).pipe(
    scan((acc, event) => {
      const unpinAndDelete = (toUnpin: string[]) => {
        deleteBlocks(acc, toUnpin)
        onUnpin(toUnpin)
      }

      switch (event.type) {
        case "initialized":
          if (
            acc.recovering &&
            !event.finalizedBlockHashes.some((hash) => acc.blocks.has(hash))
          ) {
            Object.assign(acc, getInitialPinnedBlocks())
            newBlocks$.next(null)
          }

          const latestFinalizedHeight =
            acc.blocks.get(acc.finalized)?.number ?? -1

          const lastIdx = event.finalizedBlockHashes.length - 1
          // We must take into account that the new subscription could be behind the previous one
          if (latestFinalizedHeight > event.number + lastIdx) {
            acc.recovering = { type: "fin", target: latestFinalizedHeight }
          } else {
            acc.finalized = acc.best = event.finalizedBlockHashes[lastIdx]
          }

          let latestRuntime = acc.finalizedRuntime.codeHash

          const newBlocks: Array<PinnedBlock> = []
          event.finalizedBlockHashes.forEach((hash, i) => {
            const unpinnable = i !== lastIdx
            const preexistingBlock = acc.blocks.get(hash)

            if (preexistingBlock) {
              preexistingBlock.recovering = false
              preexistingBlock.unpinnable = unpinnable
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
                unpinnable,
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
              if (isNew) newBlocks.push(block)
            }
          })
          newBlocks.forEach(onNewBlock)
          return acc

        case "stop-error":
          // if the stop-error happened during the initialization process
          if (!acc.best) return acc

          for (const block of acc.blocks.values()) {
            block.recovering = true
          }
          acc.recovering = { type: "init" }

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
              parent: parent,
              children: new Set<string>(),
              runtime: event.newRuntime ? hash : parentNode.runtime,
              unpinnable: false,
              refCount: 0,
              recovering: false,
              hasNewRuntime: !!event.newRuntime,
            }
            acc.blocks.set(hash, block)
            if (event.newRuntime) {
              const { codeHash } = event
              acc.runtimes[codeHash!] = getRuntime(codeHash!, hash)
            }

            acc.runtimes[block.runtime].addBlock(hash)
            onNewBlock(block)
          }

          return acc
        }

        case "bestBlockChanged": {
          if (acc.recovering) {
            if (acc.recovering.type === "fin") return acc
            recover(acc)
          }
          acc.best = event.bestBlockHash
          return acc
        }

        case "finalized": {
          const finalized = event.finalizedBlockHashes.slice(-1)[0]
          if (acc.recovering?.type === "fin") {
            if (acc.blocks.get(finalized)!.number < acc.recovering.target)
              return acc
            recover(acc)
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
            if (block) {
              block.unpinnable = true
            }
          })

          let current = blocks.get(blocks.get(acc.finalized)!.parent)
          while (current && !current.unpinnable) {
            current.unpinnable = true
            current = blocks.get(current.parent)
          }

          cleanup$.next()

          return acc
        }
        case "cleanup": {
          const toUnpin = [...acc.blocks.values()]
            .filter(({ unpinnable, refCount }) => unpinnable && !refCount)
            .map(({ hash }) => hash)

          unpinAndDelete(toUnpin)
          return acc
        }
        case "blockUsage": {
          if (!acc.blocks.has(event.value.hash)) return acc

          const block = acc.blocks.get(event.value.hash)!
          block.refCount += event.value.type === "hold" ? 1 : -1
          if (block.refCount === 0 && !block.recovering && block.unpinnable) {
            const toUnpin = [block.hash]
            unpinAndDelete(toUnpin)
          }
          return acc
        }
      }
    }, state),
    filter((x) => !!x.finalizedRuntime.runtime),
    map((x) => ({ ...x })),
    tap({
      error(e) {
        newBlocks$.error(e)
      },
    }),
    shareLatest,
  )

  const getRuntime = getRuntimeCreator(
    withStopRecovery(pinnedBlocks$, call$, "pinned-blocks"),
    getCachedMetadata$,
    setCachedMetadata,
  )
  return Object.assign(pinnedBlocks$, { state })
}

const getInitialPinnedBlocks = (): PinnedBlocks => ({
  best: "",
  finalized: "",
  runtimes: {},
  blocks: new Map(),
  finalizedRuntime: {} as Runtime,
  recovering: null,
})
