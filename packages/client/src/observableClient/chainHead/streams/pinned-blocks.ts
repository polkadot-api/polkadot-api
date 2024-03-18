import { shareLatest } from "@/utils"
import { BlockHeader } from "@polkadot-api/substrate-bindings"
import { FollowEventWithRuntime } from "@polkadot-api/substrate-client"
import { Observable, Subject, concatMap, map, merge, of, scan } from "rxjs"
import { Runtime, getRuntimeCreator } from "./get-runtime-creator"

export interface PinnedBlock {
  hash: string
  number: number
  parent: string
  children: Set<string>
  runtime: string
  refCount: number
  unpinned?: true
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
  const getRuntime = getRuntimeCreator(call$)
  const followWithInitializedNumber$ = follow$.pipe(
    concatMap((event) => {
      return event.type !== "initialized"
        ? of(event)
        : getHeader(event.finalizedBlockHashes.slice(-1)[0]).then((header) => ({
            ...event,
            number: header.number,
            parentHash: header.parentHash,
          }))
    }),
  )

  const pinnedBlocks$: Observable<PinnedBlocks> = merge(
    blockUsage$,
    followWithInitializedNumber$,
  ).pipe(
    scan(
      (acc, event) => {
        switch (event.type) {
          case "initialized":
            const [hash] = event.finalizedBlockHashes.slice(-1)
            acc.finalized = acc.best = hash

            acc.blocks.set(hash, {
              hash,
              parent: event.parentHash,
              children: new Set(),
              runtime: hash,
              refCount: 0,
              number: event.number,
            })
            acc.runtimes[hash] = getRuntime(hash)
            acc.finalizedRuntime = acc.runtimes[hash]
            return acc

          case "newBlock": {
            const { parentBlockHash: parent, blockHash: hash } = event
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
            }
            acc.blocks.set(hash, block)
            acc.runtimes[block.runtime].addBlock(hash)
            return acc
          }

          case "bestBlockChanged": {
            acc.best = event.bestBlockHash
            return acc
          }

          case "finalized": {
            acc.finalized = event.finalizedBlockHashes.slice(-1)[0]
            acc.finalizedRuntime =
              acc.runtimes[acc.blocks.get(acc.finalized)!.runtime]

            onUnpin(getBlocksToUnpin(acc, event.prunedBlockHashes))
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
      },
      {
        best: "",
        finalized: "",
        runtimes: {},
        blocks: new Map(),
        finalizedRuntime: {},
      } as PinnedBlocks,
    ),
    map((x) => ({ ...x })),
    shareLatest,
  )

  return pinnedBlocks$
}
