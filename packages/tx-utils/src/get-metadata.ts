import {
  decAnyMetadata,
  UnifiedMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { HexString } from "@polkadot-api/substrate-bindings"

export const getMetadata = (input: Uint8Array | HexString): UnifiedMetadata => {
  try {
    return unifyMetadata(decAnyMetadata(input))
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
