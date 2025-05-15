import {
  decAnyMetadata,
  UnifiedMetadata,
  type HexString,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"

export const getMetadata = (
  input: Uint8Array | HexString,
): UnifiedMetadata<15 | 16> => {
  try {
    const metadata = unifyMetadata(decAnyMetadata(input))
    if (metadata.version <= 14) throw new Error("Wrong metadata version")
    return metadata as UnifiedMetadata<15 | 16>
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
