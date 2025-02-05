import {
  Bytes,
  compact,
  Option,
  Struct,
} from "@polkadot-api/substrate-bindings"

export const [ChargeAssetTxPaymentEnc] = Struct({
  tip: compact,
  asset: Option(Bytes(Infinity)),
})
