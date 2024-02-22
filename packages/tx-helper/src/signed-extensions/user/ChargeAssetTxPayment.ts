import { map } from "rxjs"
import {
  Bytes,
  Option,
  Struct,
  compact,
} from "@polkadot-api/substrate-bindings"
import type { GetUserSignedExtension } from "@/internal-types"
import { empty$ } from "../utils"

const encoder = Struct({
  tip: compact,
  assetId: Option(Bytes(Infinity)),
}).enc

export const ChargeAssetTxPayment: GetUserSignedExtension<
  "ChargeAssetTxPayment"
> = (user$) => ({
  value: user$.pipe(
    map((val) =>
      encoder({
        tip: val.tip,
        assetId: val.assetId,
      }),
    ),
  ),
  additionalSigned: empty$,
})
