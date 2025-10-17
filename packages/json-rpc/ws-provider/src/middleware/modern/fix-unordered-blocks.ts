import type { Middleware } from "../types"
import { chainHead } from "../methods"

interface InitializedRpc {
  event: "initialized"
  finalizedBlockHashes: string[]
}

interface NewBlockRpc {
  event: "newBlock"
  blockHash: string
  parentBlockHash: string
}

interface BestBlockChangedRpc {
  event: "bestBlockChanged"
  bestBlockHash: string
}

interface FinalizedRpc {
  event: "finalized"
  finalizedBlockHashes: Array<string>
  prunedBlockHashes: Array<string>
}

export interface StopRpc {
  event: "stop"
}

type FollowEvent =
  | InitializedRpc
  | NewBlockRpc
  | BestBlockChangedRpc
  | FinalizedRpc
  | StopRpc

const { follow, unpin, unfollow } = chainHead
export const fixUnorderedBlocks: Middleware = (base) => (onMsg, onHalt) => {
  const pendingChainHeadSubs = new Set<string>()
  const pinnedBlocksInSub = new Map<string, Set<string>>()
  const uknownBlocksNotifications = new Map<string, Map<string, any>>()
  const withClear =
    <Args extends Array<any>>(
      fn: (...args: Args) => void,
    ): ((...args: Args) => void) =>
    (...args) => {
      ;[
        pendingChainHeadSubs,
        pinnedBlocksInSub,
        uknownBlocksNotifications,
      ].forEach((x) => {
        x.clear()
      })
      fn(...args)
    }

  const { send: originalSend, disconnect } = base((message) => {
    // it's a response
    if ("id" in message) {
      onMsg(message)
      const { id, result } = message as unknown as {
        id: string
        result: string
      }

      if (pendingChainHeadSubs.has(id)) {
        pendingChainHeadSubs.delete(id)
        pinnedBlocksInSub.set(result, new Set())
        uknownBlocksNotifications.set(result, new Map())
        return
      }
    } else {
      // it's a notification
      const { subscription } = (message as any).params
      const pinnedBlocks = pinnedBlocksInSub.get(subscription)
      const premature = uknownBlocksNotifications.get(subscription)!
      if (pinnedBlocks) {
        const result = (message as any).params.result as FollowEvent
        const { event } = result
        if (event === "initialized") {
          result.finalizedBlockHashes.forEach((hash) => {
            pinnedBlocks.add(hash)
          })
        }

        if (event === "finalized") {
          result.prunedBlockHashes = result.prunedBlockHashes.filter((x) =>
            pinnedBlocks.has(x),
          )
        }

        if (event === "newBlock") {
          pinnedBlocks.add(result.blockHash)
          const hash = result.blockHash
          const missing = premature.get(hash)
          if (missing) {
            premature.delete(hash)
            onMsg(message)
            Promise.resolve().then(() => {
              onMsg(missing)
            })
            return
          }
        }

        if (event === "bestBlockChanged") {
          const hash = result.bestBlockHash
          if (!pinnedBlocks.has(hash)) {
            uknownBlocksNotifications.get(subscription)!.set(hash, message)
            return
          }
        }

        if (event === "stop") {
          pinnedBlocks.delete(subscription)
          uknownBlocksNotifications.delete(subscription)
        }
      }
      onMsg(message)
    }
  }, withClear(onHalt))

  const send = (msg: any) => {
    const subId = msg.params[0]
    switch (msg.method) {
      case follow:
        pendingChainHeadSubs.add(msg.id)
        break

      case unpin:
        const [subscription, blocks] = msg.params as [string, string[]]
        blocks.forEach((block) => {
          pinnedBlocksInSub.get(subscription)?.delete(block)
          uknownBlocksNotifications.get(subscription)?.delete(block)
        })
        break

      case unfollow:
        pinnedBlocksInSub.delete(subId)
        uknownBlocksNotifications.delete(subId)
        break
    }
    originalSend(msg)
  }

  return {
    send,
    disconnect: withClear(disconnect),
  }
}
