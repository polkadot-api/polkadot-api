import { compactBn } from "@polkadot-api/substrate-bindings"
import { map } from "rxjs"
import type { GetUserSignedExtension } from "@/internal-types"
import { empty$ } from "../utils"

export const ChargeTransactionPayment: GetUserSignedExtension<
  "ChargeTransactionPayment"
> = (user$) => ({
  extra: user$.pipe(map(compactBn.enc)),
  additional: empty$,
})
