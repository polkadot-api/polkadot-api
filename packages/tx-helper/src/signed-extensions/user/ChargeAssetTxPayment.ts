import { map } from "rxjs"
import { Option, Struct, compact, u32 } from "@polkadot-api/substrate-bindings"
import type { GetUserSignedExtension } from "@/internal-types"
import { empty$ } from "../utils"

const encoder = Struct({
  tip: compact,
  assetId: Option(u32),
}).enc

export const ChargeAssetTxPayment: GetUserSignedExtension<
  "ChargeAssetTxPayment"
> = (user$) => ({
  value: user$.pipe(map(encoder)),
  additionalSigned: empty$,
})
