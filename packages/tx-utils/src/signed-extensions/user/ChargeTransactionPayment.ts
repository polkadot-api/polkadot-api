import { compact } from "@polkadot-api/substrate-bindings"
import { empty, signedExtension } from "../utils"
import { SignedExtension } from "../internal-types"

export const ChargeTransactionPayment = (
  tip: number | bigint,
): SignedExtension => signedExtension(compact.enc(tip), empty)
