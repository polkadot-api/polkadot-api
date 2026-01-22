import type { SubstrateClient } from "@polkadot-api/substrate-client"
import { toHex } from "@polkadot-api/utils"
import { Observable } from "rxjs"

export default (baseTransaction: SubstrateClient["transaction"]) =>
  (transaction: Uint8Array) =>
    new Observable<never>((observer) =>
      baseTransaction(toHex(transaction), (e) => {
        observer.error(e)
      }),
    )
