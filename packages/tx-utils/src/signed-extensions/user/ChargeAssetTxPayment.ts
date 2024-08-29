import {
  Bytes,
  Option,
  Struct,
  compact,
} from "@polkadot-api/substrate-bindings"
import { empty, signedExtension } from "../utils"
import { SignedExtension } from "../internal-types"

const encoder = Struct({
  tip: compact,
  asset: Option(Bytes(Infinity)),
}).enc

export const ChargeAssetTxPayment = (
  tip: number | bigint,
  asset: Uint8Array | undefined,
): SignedExtension =>
  signedExtension(
    encoder({
      tip,
      asset,
    }),
    empty,
  )
