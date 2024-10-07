import { MetadataLookup } from "@polkadot-api/metadata-builders"
import type { SignedExtension } from "../internal-types"
import { empty, signedExtension, systemVersionProp } from "../utils"

export const CheckSpecVersion = (lookupFn: MetadataLookup): SignedExtension =>
  signedExtension(empty, systemVersionProp("spec_version", lookupFn))
