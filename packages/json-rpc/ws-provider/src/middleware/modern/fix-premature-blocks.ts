import { chainHead } from "./methods"
import type { Middleware } from "../types"
import { JsonRpcMessage } from "@polkadot-api/json-rpc-provider"

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

export const fixPrematureBlocks: Middleware = (base) => (onMsg, onHalt) => {
  const pendingChainHeadSubs = new Set<string>()
  const pinnedBlocksInSub = new Map<string, Set<string>>()
  const prematureBlocks = new Map<string, Map<string, Array<JsonRpcMessage>>>()
  const withClear =
    <Args extends Array<any>>(
      fn: (...args: Args) => void,
    ): ((...args: Args) => void) =>
    (...args) => {
      ;[pendingChainHeadSubs, pinnedBlocksInSub, prematureBlocks].forEach(
        (x) => {
          x.clear()
        },
      )
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
        prematureBlocks.set(result, new Map())
        return
      }
    } else {
      // it's a notification
      const { subscription } = (message as any).params
      const pinnedBlocks = pinnedBlocksInSub.get(subscription)
      const prematureSub = prematureBlocks.get(subscription)!
      if (pinnedBlocks) {
        const result = (message as any).params.result as FollowEvent
        const { event } = result
        if (event === "initialized") {
          result.finalizedBlockHashes.forEach((hash) => {
            pinnedBlocks.add(hash)
          })
        }

        if (event === "newBlock") {
          const { parentBlockHash } = result
          if (!pinnedBlocks.has(parentBlockHash)) {
            const list = prematureSub.get(parentBlockHash) ?? []
            list.push(message)
            prematureSub.set(parentBlockHash, list)
            return
          }

          const hash = result.blockHash
          pinnedBlocks.add(result.blockHash)
          onMsg(message)

          const prematureMessages = prematureSub.get(hash)
          if (prematureMessages) {
            prematureSub.delete(hash)
            prematureMessages.forEach((msg) => {
              pinnedBlocks.add((msg as any).params.result.blockHash)
              onMsg(msg)
            })
          }
          return
        }

        if (event === "stop") {
          pinnedBlocks.delete(subscription)
          prematureBlocks.delete(subscription)
        }
      }
      onMsg(message)
    }
  }, withClear(onHalt))

  const send = (msg: any) => {
    const subId = msg.params[0]
    switch (msg.method) {
      case chainHead.follow:
        pendingChainHeadSubs.add(msg.id)
        break

      case chainHead.unpin:
        const [subscription, blocks] = msg.params as [string, string[]]
        blocks.forEach((block) => {
          pinnedBlocksInSub.get(subscription)?.delete(block)
          prematureBlocks.get(subscription)?.delete(block)
        })
        break

      case chainHead.unfollow:
        pinnedBlocksInSub.delete(subId)
        prematureBlocks.delete(subId)
        break
    }
    originalSend(msg)
  }

  return {
    send,
    disconnect: withClear(disconnect),
  }
}
