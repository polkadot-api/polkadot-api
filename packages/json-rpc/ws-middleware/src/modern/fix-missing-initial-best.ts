import { chainHead } from "@/methods"
import { Middleware } from "@/types"
import { operationNotification } from "@/utils"

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

const cancelEvents = new Set(["newBlock", "bestBlockChanged", "stop"])

export const fixMissingInitialBest: Middleware = (base) => (onMsg, onHalt) => {
  const pendingChainHeadSubs = new Set<string>()
  const pendingChainHeads = new Map<string, () => void>()
  const withClear =
    <Args extends Array<any>>(
      fn: (...args: Args) => void,
    ): ((...args: Args) => void) =>
    (...args) => {
      ;[pendingChainHeadSubs, pendingChainHeads].forEach((x) => {
        x.clear()
      })
      fn(...args)
    }

  const { send: originalSend, disconnect } = base((message) => {
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
            onMsg(
              operationNotification(
                subscription,
                "bestBlockChanged",
                undefined,
                { bestBlockHash: result.finalizedBlockHashes.at(-1) },
              ),
            )
          }, 500)

          pendingChainHeads.set(subscription, () => {
            pendingChainHeads.delete(subscription)
            clearTimeout(token)
          })
        } else if (cancelEvents.has(event)) cancel()
      }
    }

    onMsg(message)
  }, withClear(onHalt))

  return {
    send(msg: any) {
      switch (msg.method) {
        case chainHead.follow:
          pendingChainHeadSubs.add(msg.id)
          break

        case chainHead.unfollow:
          pendingChainHeads.get(msg.params[0])?.()
      }
      originalSend(msg)
    },
    disconnect: withClear(disconnect),
  }
}
