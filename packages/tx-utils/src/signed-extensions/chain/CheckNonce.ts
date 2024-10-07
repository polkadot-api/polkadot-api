import { compact } from "@polkadot-api/substrate-bindings"
import type { SignedExtension } from "../internal-types"
import { empty, signedExtension } from "../utils"

export const CheckNonce = (nonce: number | bigint): SignedExtension =>
  signedExtension(compact.enc(nonce), empty)
