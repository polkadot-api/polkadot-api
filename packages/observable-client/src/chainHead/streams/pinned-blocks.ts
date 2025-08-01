import { shareLatest } from "@/utils"
import { HexString } from "@polkadot-api/substrate-bindings"
import {
  Observable,
  Subject,
  exhaustMap,
  filter,
  map,
  merge,
  scan,
  timer,
} from "rxjs"
import { withStopRecovery } from "../enhancers"
import type { FollowEvent } from "./follow"
import { Runtime, getRuntimeCreator } from "./get-runtime-creator"

export interface PinnedBlock {
  hash: string
  number: number
  parent: string
  children: Set<string>
  runtime: string
  unpinnable: boolean
  refCount: number
  recovering: boolean
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
  recovering: boolean
}

const createRuntimeGetter = (pinned: PinnedBlocks, startAt: HexString) => {
  return () => {
    const runtime = pinned.runtimes[startAt]
    if (!runtime) return pinned.blocks.has(startAt) ? startAt : null
    const winner = [...runtime.usages].at(-1)
    return winner ?? null
  }
}

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
  getCodeHash$: (blockHash: string) => Observable<string>,
  getCachedMetadata$: (codeHash: string) => Observable<Uint8Array | null>,
  setCachedMetadata: (codeHash: string, metadataRaw: Uint8Array) => void,
  blockUsage$: Subject<BlockUsageEvent>,
  onUnpin: (blocks: string[]) => void,
  deleteFromCache: (block: string) => void,
) => {
  const cleanup$ = new Subject<void>()
  const cleanupEvt$ = cleanup$.pipe(
    exhaustMap(() => timer(0)),
    map(
      (): CleanupEvent => ({
        type: "cleanup" as const,
      }),
    ),
  )
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
          )
            acc = getInitialPinnedBlocks()

          const lastIdx = event.finalizedBlockHashes.length - 1
          acc.finalized = acc.best = event.finalizedBlockHashes[lastIdx]
          let latestRuntime = acc.finalizedRuntime.at

          event.finalizedBlockHashes.forEach((hash, i) => {
            const unpinnable = i !== lastIdx
            const preexistingBlock = acc.blocks.get(hash)

            if (preexistingBlock) {
              preexistingBlock.recovering = false
              preexistingBlock.unpinnable = unpinnable
            } else {
              const isNewRuntime = event.runtimeChanges.has(hash)
              if (isNewRuntime) latestRuntime = hash

              acc.blocks.set(hash, {
                hash: hash,
                parent:
                  i === 0
                    ? event.parentHash
                    : event.finalizedBlockHashes[i - 1],
                children: new Set(
                  i === lastIdx ? [] : [event.finalizedBlockHashes[i + 1]],
                ),
                unpinnable,
                runtime: latestRuntime,
                refCount: 0,
                number: event.number + i,
                recovering: false,
              })

              // it must happen after setting the block
              if (isNewRuntime)
                acc.finalizedRuntime = acc.runtimes[hash] = getRuntime(
                  createRuntimeGetter(acc, hash),
                )

              acc.runtimes[latestRuntime].usages.add(hash)
            }
          })
          return acc

        case "stop-error":
          for (const block of acc.blocks.values()) {
            block.recovering = true
          }
          acc.recovering = true

          return acc

        case "newBlock": {
          const { parentBlockHash: parent, blockHash: hash } = event
          if (acc.blocks.has(hash)) {
            acc.blocks.get(hash)!.recovering = false
          } else {
            const parentNode = acc.blocks.get(parent)!
            parentNode.children.add(hash)
            const block = {
              hash,
              number: parentNode.number + 1,
              parent: parent,
              children: new Set<string>(),
              runtime: event.newRuntime ? hash : parentNode.runtime,
              unpinnable: false,
              refCount: 0,
              recovering: false,
            }
            acc.blocks.set(hash, block)
            if (event.newRuntime) {
              // getRuntime calls getHash immediately
              // it assumes pinnedBlocks.runtimes[hash] is empty and pinnedBlocks.blocks.has(hash)
              acc.runtimes[hash] = getRuntime(createRuntimeGetter(acc, hash))
            }

            acc.runtimes[block.runtime].addBlock(hash)
          }

          return acc
        }

        case "bestBlockChanged": {
          if (acc.recovering) {
            for (const [hash, block] of acc.blocks) {
              if (block.recovering) {
                deleteBlock(acc.blocks, hash)
                deleteFromCache(hash)
              }
            }
            acc.recovering = false
          }
          acc.best = event.bestBlockHash
          return acc
        }

        case "finalized": {
          acc.finalized = event.finalizedBlockHashes.slice(-1)[0]
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
    }, getInitialPinnedBlocks()),
    filter((x) => !!x.finalizedRuntime.runtime),
    map((x) => ({ ...x })),
    shareLatest,
  )

  const getRuntime = getRuntimeCreator(
    withStopRecovery(pinnedBlocks$, call$, "pinned-blocks"),
    withStopRecovery(pinnedBlocks$, getCodeHash$, "pinned-blocks"),
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
  recovering: false,
})
