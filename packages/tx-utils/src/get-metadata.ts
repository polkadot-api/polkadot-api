import {
  decAnyMetadata,
  NormalizedMetadata,
  normalizeMetadata,
} from "@polkadot-api/substrate-bindings"
import { HexString } from "@polkadot-api/substrate-bindings"

export const getMetadata = (
  input: Uint8Array | HexString,
): NormalizedMetadata => {
  try {
    return normalizeMetadata(decAnyMetadata(input))
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
