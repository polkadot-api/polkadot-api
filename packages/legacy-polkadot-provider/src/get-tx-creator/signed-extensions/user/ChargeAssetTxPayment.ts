import { map } from "rxjs"
import {
  Option,
  Struct,
  compact,
  Bytes,
} from "@polkadot-api/substrate-bindings"
import type { GetUserSignedExtension } from "@/types/internal-types"
import { toHex } from "@polkadot-api/utils"

const encoder = Struct({
  tip: compact,
  asset: Option(Bytes(Infinity)),
}).enc

export const ChargeAssetTxPayment: GetUserSignedExtension<
  "ChargeAssetTxPayment"
> = (user$) =>
  user$.pipe(
    map((val) => ({
      extra: encoder({
        tip: val.tip,
        asset: val.asset,
      }),
      additional: new Uint8Array(),
      pjs: {
        ...(val.asset ? { assetId: toHex(val.asset) } : {}),
        ...(val.tip > 0n ? { tip: "0x" + val.tip.toString(16) } : {}),
      },
    })),
  )
