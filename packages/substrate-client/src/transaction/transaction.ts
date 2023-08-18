import type { ClientRequest } from "../client"
import { TxEvent } from "./types"

const finalEvents = new Set(["dropped", "invalid", "finalized"])

export const transaction =
  (request: ClientRequest<string, TxEvent>) =>
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
