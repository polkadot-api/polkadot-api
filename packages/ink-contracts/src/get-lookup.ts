import { denormalizeLookup, LookupEntry } from "@polkadot-api/metadata-builders"
import { v14Lookup } from "@polkadot-api/substrate-bindings"
import { InkMetadata } from "./metadata-types"
import { pjsTypes } from "./metadata-pjs-types"

export interface InkMetadataLookup {
  (id: number): LookupEntry
  metadata: InkMetadata
}

export const getInkLookup = (metadata: InkMetadata) => {
  // We can reuse dynamic-builder's lookup if we encode and re-decode the type
  // into V14Lookup, because both v14 metadata lookup and ink types use scale-info
  const encoded = pjsTypes.enc(metadata.types)
  const decoded = v14Lookup.dec(encoded)
  const getLookupEntryDef = denormalizeLookup(decoded)

  return Object.assign(getLookupEntryDef, { metadata })
}
