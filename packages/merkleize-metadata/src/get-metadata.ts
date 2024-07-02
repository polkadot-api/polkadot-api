import {
  Option,
  Bytes,
  metadata,
  compact,
  Tuple,
  V15,
} from "@polkadot-api/substrate-bindings"
import { HexString } from "@polkadot-api/substrate-bindings"

const opaqueBytes = Bytes()
const optionOpaque = Option(opaqueBytes)
const opaqueOpaqueBytes = Tuple(compact, opaqueBytes)

const getAnyMetadata = (input: Uint8Array | HexString) => {
  try {
    return metadata.dec(input)
  } catch (_) {}

  // comes from metadata.metadata_at_version
  try {
    return metadata.dec(optionOpaque.dec(input)!)
  } catch (_) {}

  // comes from state.getMetadata
  try {
    return metadata.dec(opaqueBytes.dec(input))
  } catch (_) {}

  // comes from metadata.metadata
  try {
    return metadata.dec(opaqueOpaqueBytes.dec(input)[1])
  } catch (_) {}

  throw null
}

export const getMetadata = (input: Uint8Array | HexString): V15 => {
  try {
    const { metadata } = getAnyMetadata(input)
    if (metadata.tag !== "v15") throw new Error("Wrong metadata version")
    return metadata.value
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
