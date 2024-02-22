import { map } from "rxjs"
import {
  Option,
  Struct,
  compact,
  Bytes,
} from "@polkadot-api/substrate-bindings"
import type { GetUserSignedExtension } from "@/types/internal-types"

const encoder = Struct({
  tip: compact,
  assetId: Option(Bytes(Infinity)),
}).enc

export const ChargeAssetTxPayment: GetUserSignedExtension<
  "ChargeAssetTxPayment"
> = (user$) =>
  user$.pipe(
    map((val) => ({
      extra: encoder({
        tip: val.tip,
        assetId: val.assetId,
      }),
      additional: new Uint8Array(),
      pjs: {},
    })),
  )
