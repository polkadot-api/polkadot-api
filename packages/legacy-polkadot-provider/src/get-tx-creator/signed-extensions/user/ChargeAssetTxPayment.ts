import { map } from "rxjs"
import { Option, Struct, compact, u32 } from "@polkadot-api/substrate-bindings"
import type { GetUserSignedExtension } from "@/types/internal-types"

const encoder = Struct({
  tip: compact,
  assetId: Option(u32),
}).enc

export const ChargeAssetTxPayment: GetUserSignedExtension<
  "ChargeAssetTxPayment"
> = (user$) =>
  user$.pipe(
    map((val) => ({
      extra: encoder(val),
      additional: new Uint8Array(),
      pjs: {},
    })),
  )
