import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata } from "@polkadot-api/substrate-bindings"

export function getCodecs(metadata: Uint8Array) {
  let lookup
  let dynamicBuilder
  try {
    const tmpMeta = decAnyMetadata(metadata).metadata
    if (tmpMeta.tag !== "v14" && tmpMeta.tag !== "v15") throw null
    lookup = getLookupFn(tmpMeta.value)
    if (lookup.call === null) throw null
    dynamicBuilder = getDynamicBuilder(lookup)
  } catch (_) {
    throw new Error("Unsupported metadata version")
  }
  return {
    lookup,
    dynamicBuilder,
    callCodec: dynamicBuilder.buildDefinition(lookup.call),
  }
}
