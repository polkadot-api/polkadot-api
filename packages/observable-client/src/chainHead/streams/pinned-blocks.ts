import { shareLatest } from "@/utils"
import { BlockHeader } from "@polkadot-api/substrate-bindings"
import { FollowEventWithRuntime } from "@polkadot-api/substrate-client"
import {
  Observable,
  Subject,
  concatMap,
  filter,
  map,
  merge,
  of,
  scan,
} from "rxjs"
import { retryOnStopError } from "./follow"
import { Runtime, getRuntimeCreator } from "./get-runtime-creator"
import { withStopRecovery } from "../enhancers"

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

const deleteBlock = (blocks: PinnedBlocks["blocks"], blockHash: string) => {
  blocks.get(blocks.get(blockHash)!.parent)?.children.delete(blockHash)
  blocks.delete(blockHash)
}

const getBlocksToUnpin = (blocks: PinnedBlocks, pruned: string[]) => {
  const result: string[] = [...pruned]
  let current = blocks.blocks.get(blocks.blocks.get(blocks.finalized)!.parent)

  const trail: string[] = []
  while (current) {
    trail.push(current.hash)
    if (current.refCount === 0 && !current.unpinned) {
      result.push(current.hash)
      current.unpinned = true
    }

    current = blocks.blocks.get(current.parent)
  }

  const deletedBlocks = [...pruned]
  for (let i = trail.length - 1; i >= 0; i--) {
    current = blocks.blocks.get(trail[i])!
    if (!current.unpinned) return result
    deletedBlocks.push(current.hash)
  }

  deletedBlocks.forEach((hash) => {
    deleteBlock(blocks.blocks, hash)
  })

  Object.entries(blocks.runtimes)
    .map(([key, value]) => ({
      key,
      usages: value.deleteBlocks(deletedBlocks),
    }))
    .filter((x) => x.usages === 0)
    .map((x) => x.key)
    .forEach((unusedRuntime) => {
      delete blocks.runtimes[unusedRuntime]
    })
  return result
}

export const getPinnedBlocks$ = (
  follow$: Observable<FollowEventWithRuntime>,
  getHeader: (hash: string) => Promise<BlockHeader>,
  call$: (hash: string, method: string, args: string) => Observable<string>,
  blockUsage$: Subject<BlockUsageEvent>,
  onUnpin: (blocks: string[]) => void,
) => {
  const pinnedBlocks$: Observable<PinnedBlocks> = merge(
    blockUsage$,
    follow$.pipe(withInitializedNumber(getHeader), retryOnStopError()),
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
            (acc.runtimes[finalizedHash] = getRuntime(finalizedHash))
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
            if (event.newRuntime) {
              acc.runtimes[hash] = getRuntime(hash)
              acc.runtimes[hash].runtime.subscribe()
            }
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
            acc.runtimes[block.runtime].addBlock(hash)
          }

          return acc
        }

        case "bestBlockChanged": {
          if (acc.recovering) {
            for (const [hash, block] of acc.blocks) {
              if (block.recovering) {
                deleteBlock(acc.blocks, hash)
              }
            }
            acc.recovering = false
          }
          acc.best = event.bestBlockHash
          return acc
        }

        case "finalized": {
          acc.finalized = event.finalizedBlockHashes.slice(-1)[0]
          acc.finalizedRuntime =
            acc.runtimes[acc.blocks.get(acc.finalized)!.runtime]

          // TODO: remove this once https://github.com/paritytech/polkadot-sdk/issues/3658 is fixed
          const actuallyPruned = [...new Set(event.prunedBlockHashes)]
          onUnpin(getBlocksToUnpin(acc, actuallyPruned))
          return acc
        }

        case "blockUsage": {
          if (!acc.blocks.has(event.value.hash)) return acc

          const block = acc.blocks.get(event.value.hash)!
          block.refCount += event.value.type === "hold" ? 1 : -1
          if (
            block.refCount === 0 &&
            block.number < acc.blocks.get(acc.finalized)!.number
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

  const getRuntime = getRuntimeCreator(withStopRecovery(pinnedBlocks$, call$))

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

const withInitializedNumber =
  (getHeader: (hash: string) => Promise<BlockHeader>) =>
  (source$: Observable<FollowEventWithRuntime>) =>
    source$.pipe(
      concatMap((event) => {
        return event.type !== "initialized"
          ? of(event)
          : getHeader(event.finalizedBlockHashes[0]).then((header) => ({
              ...event,
              number: header.number,
              parentHash: header.parentHash,
            }))
      }),
    )
