import type { ClientRequest } from "../client"
import type { TxEvent, Transaction } from "./types"

const finalEvents = new Set(["dropped", "invalid", "finalized"])

export const getTransaction =
  (request: ClientRequest<string, TxEvent>): Transaction =>
  (tx: string, next: (event: TxEvent) => void, error: (e: Error) => void) => {
    let cancel = request(
      "transaction_unstable_submitAndWatch",
      [tx],
      (subscriptionId, follow) => {
        const done = follow(subscriptionId, {
          next: (event) => {
            if (finalEvents.has(event.event)) done()
            next(event)
          },
          error,
        })

        cancel = () => {
          done()
          request("transaction_unstable_unwatch", [subscriptionId])
        }
      },
    )

    return () => {
      cancel()
    }
  }
