import { noop } from "@/internal-utils"
import { type ClientRequest } from "../client"

const getTxBroadcastNames = (input: Set<string>): [string, string] => {
  // Proper
  if (input.has("transaction_v1_broadcast"))
    return ["transaction_v1_broadcast", "transaction_v1_stop"]

  // Fallback for versions not up-to-date yet
  if (input.has("transactionWatch_unstable_submitAndWatch"))
    return [
      "transactionWatch_unstable_submitAndWatch",
      "transactionWatch_unstable_unwatch",
    ]

  // Fallback for very old versions
  return ["transaction_unstable_submitAndWatch", "transaction_unstable_unwatch"]
}

export const getTransaction =
  (
    request: ClientRequest<string, any>,
    rpcMethods: Promise<Set<string>> | Set<string>,
  ) =>
  (tx: string, error: (e: Error) => void) => {
    const broadcast = (
      tx: string,
      broadcastFn: string,
      cancelBroadcastFn: string,
    ) =>
      request(broadcastFn, [tx], {
        onSuccess: (subscriptionId) => {
          cancel =
            subscriptionId === null
              ? noop
              : () => {
                  request(cancelBroadcastFn, [subscriptionId])
                }

          if (subscriptionId === null) {
            error(
              new Error("Max # of broadcasted transactions has been reached"),
            )
          }
        },
        onError: error,
      })

    let isActive = true
    let cancel = () => {
      isActive = false
    }

    if (rpcMethods instanceof Promise) {
      rpcMethods.then(getTxBroadcastNames).then((names) => {
        if (!isActive) return
        cancel = broadcast(tx, ...names)
      })
    } else cancel = broadcast(tx, ...getTxBroadcastNames(rpcMethods))

    return () => {
      cancel()
    }
  }
