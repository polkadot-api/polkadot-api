import {
  decAnyMetadata,
  NormalizedMetadata,
  normalizeMetadata,
  type HexString,
} from "@polkadot-api/substrate-bindings"

export const getMetadata = (
  input: Uint8Array | HexString,
): NormalizedMetadata<15 | 16> => {
  try {
    const metadata = normalizeMetadata(decAnyMetadata(input))
    if (metadata.version === 14) throw new Error("Wrong metadata version")
    return metadata as NormalizedMetadata<15 | 16>
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
