import { noop } from "@/internal-utils"
import { type ClientRequest } from "../client"
import { transaction } from "@/methods"

export const getTransaction =
  (request: ClientRequest<string, any>) =>
  (tx: string, error: (e: Error) => void) => {
    let cancel = request(transaction.broadcast, [tx], {
      onSuccess: (subscriptionId) => {
        cancel =
          subscriptionId === null
            ? noop
            : () => {
                request(transaction.stop, [subscriptionId])
              }

        if (subscriptionId === null) {
          error(new Error("Max # of broadcasted transactions has been reached"))
        }
      },
      onError: error,
    })

    return () => {
      cancel()
    }
  }
