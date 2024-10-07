import { V15, V14, decAnyMetadata } from "@polkadot-api/substrate-bindings"
import { HexString } from "@polkadot-api/substrate-bindings"

export const getMetadata = (input: Uint8Array | HexString): V14 | V15 => {
  try {
    const { metadata } = decAnyMetadata(input)
    if (metadata.tag !== "v14" && metadata.tag !== "v15")
      throw new Error("Wrong metadata version")
    return metadata.value
  } catch (e) {
    throw e || new Error("Unable to decode metadata")
  }
}
