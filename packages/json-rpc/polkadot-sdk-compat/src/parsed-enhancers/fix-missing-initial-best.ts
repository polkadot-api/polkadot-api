import { chainHead } from "@/methods"
import type { ParsedJsonRpcEnhancer } from "@/parsed"

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

export const fixMissingInitialBest: ParsedJsonRpcEnhancer =
  (base) => (onMsg) => {
    const pendingChainHeadSubs = new Set<string>()
    const pendingChainHeads = new Map<string, () => void>()

    const { send, disconnect } = base((message) => {
      // it's a response
      if ("id" in message) {
        const { id, result } = message as unknown as {
          id: string
          result: string
        }

        if (pendingChainHeadSubs.has(id)) {
          pendingChainHeadSubs.delete(id)
          pendingChainHeads.set(result, () => {
            pendingChainHeads.delete(result)
          })
        }
      } else {
        const { subscription } = (message as any).params
        const cancel = pendingChainHeads.get(subscription)
        if (cancel) {
          const result = (message as any).params.result as FollowEvent
          const { event } = result
          if (event === "initialized") {
            // It's an heuristic.
            // The initial blocks that are ahead of the latest finalized one
            // should arrive "synchronosuly" after the "initialized" event
            // Therefore, if after 1/2 sec we havent received those events, it's
            // safe to assume that we are in the buggy situation descrived in https://github.com/polkadot-api/polkadot-api/issues/1244
            // Sw we will "manually" trigger the `bestBlockChanged` event.
            const token = setTimeout(() => {
              pendingChainHeads.delete(subscription)
              onMsg({
                event: "bestBlockChanged",
                bestBlockHash: result.finalizedBlockHashes.at(-1),
              })
            }, 500)

            pendingChainHeads.set(subscription, () => {
              pendingChainHeads.delete(subscription)
              clearTimeout(token)
            })
          } else cancel()
        }
      }

      onMsg(message)
    })

    return {
      send(msg: any) {
        switch (msg.method) {
          case chainHead.follow:
            pendingChainHeadSubs.add(msg.id)
            break

          case chainHead.unfollow:
            pendingChainHeads.get(msg.params[0])?.()
        }
        send(msg)
      },
      disconnect,
    }
  }
