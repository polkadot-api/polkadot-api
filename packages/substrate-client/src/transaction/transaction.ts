import type { ClientRequest } from "../client"
import { TxEvent } from "./types"

const finalEvents = new Set(["dropped", "invalid", "finalized"])

export const transaction =
  (request: ClientRequest<string, TxEvent>) =>
  (tx: string, cb: (event: TxEvent) => void) =>
    request(
      "transaction_unstable_submitAndWatch",
      [tx],
      (result: string, follow) => {
        follow(
          (event, done) => {
            if (finalEvents.has(event.event)) done()
            cb(event)
          },
          result,
          "transaction_unstable_unwatch",
        )
      },
    )
