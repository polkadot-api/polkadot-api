import {
  decAnyMetadata,
  type HexString,
  type V15,
} from "@polkadot-api/substrate-bindings"

export const getMetadata = (input: Uint8Array | HexString): V15 => {
  try {
    const { metadata } = decAnyMetadata(input)
    if (metadata.tag !== "v15") throw new Error("Wrong metadata version")
    return metadata.value
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
