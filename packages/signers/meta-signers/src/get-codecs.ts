import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"

export function getCodecs(metadata: Uint8Array) {
  const tmpMeta = unifyMetadata(decAnyMetadata(metadata))
  const lookup = getLookupFn(tmpMeta)
  if (lookup.call === null) throw new Error("Unsupported metadata")
  const dynamicBuilder = getDynamicBuilder(lookup)

  return {
    lookup,
    dynamicBuilder,
    callCodec: dynamicBuilder.buildDefinition(lookup.call),
  }
}
