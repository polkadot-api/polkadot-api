import { map } from "rxjs"
import type { GetChainSignedExtension } from "../internal-types"
import { additionalSigned, systemVersionProp$ } from "../utils"

export const CheckTxVersion: GetChainSignedExtension = ({ lookupFn }) =>
  systemVersionProp$("transaction_version", lookupFn).pipe(
    map(additionalSigned),
  )
