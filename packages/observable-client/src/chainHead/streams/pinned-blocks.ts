import { shareLatest } from "@/utils"
import { HexString } from "@polkadot-api/substrate-bindings"
import { Observable, Subject, filter, map, merge, scan } from "rxjs"
import { withStopRecovery } from "../enhancers"
import type { FollowEvent } from "./follow"
import { Runtime, getRuntimeCreator } from "./get-runtime-creator"

export interface PinnedBlock {
  hash: string
  number: number
  parent: string
  children: Set<string>
  runtime: string
  refCount: number
  unpinned?: true
  recovering: boolean
}

export interface BlockUsageEvent {
  type: "blockUsage"
  value: { type: "hold"; hash: string } | { type: "release"; hash: string }
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
    const winner = [...runtime.usages]
      .reverse()
      .find((x) => !pinned.blocks.get(x)!.unpinned)
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
  blockUsage$: Subject<BlockUsageEvent>,
  onUnpin: (blocks: string[]) => void,
  deleteFromCache: (block: string) => void,
) => {
  const pinnedBlocks$: Observable<PinnedBlocks> = merge(
    blockUsage$,
    follow$,
  ).pipe(
    scan((acc, event) => {
      switch (event.type) {
        case "initialized":
          if (acc.recovering) {
            const isConnected = event.finalizedBlockHashes.some((hash) =>
              acc.blocks.has(hash),
            )
            if (!isConnected) {
              acc = getInitialPinnedBlocks()
            }
          }

          const [finalizedHash] = event.finalizedBlockHashes.slice(-1)
          acc.finalized = acc.best = finalizedHash

          const lastIdx = event.finalizedBlockHashes.length - 1
          event.finalizedBlockHashes.forEach((hash, i) => {
            if (acc.blocks.has(hash)) {
              acc.blocks.get(hash)!.recovering = false
            } else {
              acc.blocks.set(hash, {
                hash: hash,
                parent:
                  i === 0
                    ? event.parentHash
                    : event.finalizedBlockHashes[i - 1],
                children: new Set(
                  i === lastIdx ? [] : [event.finalizedBlockHashes[i + 1]],
                ),
                runtime: hash,
                refCount: 0,
                number: event.number + i,
                recovering: false,
              })
            }
          })

          const finalizedRuntime = Object.values(acc.runtimes).find((runtime) =>
            runtime.usages.has(finalizedHash),
          )

          acc.finalizedRuntime =
            finalizedRuntime ??
            (acc.runtimes[finalizedHash] = getRuntime(
              createRuntimeGetter(acc, finalizedHash),
            ))

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

          const { prunedBlockHashes: prunned } = event
          deleteBlocks(acc, prunned)
          onUnpin(prunned)

          // The consumer needs to have a chance to start operations
          // on some of the finalized blocks
          setTimeout(() => {
            const trail: string[] = []
            const toUnpin: string[] = []
            let current = blocks.get(blocks.get(acc.finalized)!.parent)
            while (current) {
              const { hash } = current
              trail.push(hash)
              if (current.refCount === 0 && !current.unpinned) {
                current.unpinned = true
                // A stop event took place in-between, then it should
                // be removed, but not be **actully** unpinned.
                if (current.recovering) deleteFromCache(hash)
                else toUnpin.push(hash)
              }
              current = blocks.get(current.parent)
            }

            const toDelete: string[] = []
            for (let i = trail.length - 1; i >= 0; i--) {
              current = blocks.get(trail[i])!
              if (!current.unpinned) break
              toDelete.push(current.hash)
            }

            deleteBlocks(acc, toDelete)
            onUnpin(toUnpin)
          }, 0)
          return acc
        }

        case "blockUsage": {
          if (!acc.blocks.has(event.value.hash)) return acc

          const block = acc.blocks.get(event.value.hash)!
          block.refCount += event.value.type === "hold" ? 1 : -1
          if (
            block.refCount === 0 &&
            block.number < acc.blocks.get(acc.finalized)!.number &&
            !block.recovering
          ) {
            block.unpinned = true
            onUnpin([block.hash])
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
