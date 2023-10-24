import type {
  SubstrateClient,
  TxBestChainBlockIncluded,
  TxBroadcasted,
  TxDropped,
  TxFinalized,
  TxInvalid,
  TxValidated,
} from "@polkadot-api/substrate-client"
import { Observable } from "rxjs"

const terminalTxEvents = new Set(["error", "finalized", "invalid", "dropped"])

export default (baseTransaction: SubstrateClient["transaction"]) =>
  (transaction: string) =>
    new Observable<
      | TxValidated
      | TxBroadcasted
      | TxBestChainBlockIncluded
      | TxFinalized
      | TxInvalid
      | TxDropped
    >((observer) =>
      baseTransaction(
        transaction,
        (event) => {
          if (event.type === "error")
            return observer.error(new Error(event.error))

          observer.next()
          if (terminalTxEvents.has(event.type)) observer.complete()
        },
        (error) => {
          observer.error(error)
        },
      ),
    )
