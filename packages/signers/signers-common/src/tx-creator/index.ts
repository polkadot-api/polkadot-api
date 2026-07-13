import { EnhancerSpecs } from "@polkadot-api/tx-creator"
import {
  withCommonExtensions,
  type ChargeAssetTxPaymentSpec,
} from "./common-enhancer"
import { withNonce, type NonceArgSpec } from "./nonce-enhancer"

export type CommonEnhancersSpecs = [
  ...EnhancerSpecs<ReturnType<typeof withNonce>>,
  ...EnhancerSpecs<typeof withCommonExtensions>,
]

export {
  ChargeAssetTxPaymentSpec,
  NonceArgSpec,
  withCommonExtensions,
  withNonce,
}
