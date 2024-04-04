import type { SubstrateClient } from "@polkadot-api/substrate-client"
import { Observable } from "rxjs"

export default (baseTransaction: SubstrateClient["transaction"]) =>
  (transaction: string) =>
    new Observable<never>((observer) =>
      baseTransaction(transaction, (e) => {
        observer.error(e)
      }),
    )
