import {
  getDynamicBuilder,
  getLookupFn,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"

let memoized: {
  key: string
  value: {
    lookupFn: MetadataLookup
    builder: ReturnType<typeof getDynamicBuilder>
  }
} | null = null

export const getLookupFromRawMetadata = (metadata: string) => {
  if (memoized?.key === metadata) return memoized.value

  const lookupFn = getLookupFn(unifyMetadata(decAnyMetadata(metadata)))
  const builder = getDynamicBuilder(lookupFn)
  memoized = {
    key: metadata,
    value: { lookupFn, builder },
  }
  return memoized.value
}
