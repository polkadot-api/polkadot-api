import { MetadataLookup } from "@polkadot-api/metadata-builders"
import type { SignedExtension } from "../internal-types"
import { empty, signedExtension, systemVersionProp } from "../utils"

export const CheckTxVersion = (
  lookupFn: MetadataLookup,
  transactionVersion?: number,
): SignedExtension =>
  signedExtension(
    empty,
    systemVersionProp("transaction_version", lookupFn, transactionVersion),
  )
