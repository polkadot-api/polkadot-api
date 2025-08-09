import { noop } from "@/internal-utils"
import { type ClientRequest } from "@polkadot-api/raw-client"
import { transaction } from "@/methods"

export const getTransaction =
  (request: ClientRequest<string, any>) =>
  (tx: string, error: (e: Error) => void) => {
    let isDone = false
    let cancel = () => {
      isDone = true
    }

    request(transaction.broadcast, [tx], {
      onSuccess: (subscriptionId) => {
        if (subscriptionId !== null) {
          cancel = () => {
            request(transaction.stop, [subscriptionId])
            cancel = noop
          }
          if (isDone) cancel()
        } else if (!isDone) {
          error(new Error("Max # of broadcasted transactions has been reached"))
        }
      },
      onError: error,
    })

    return () => {
      cancel()
    }
  }
