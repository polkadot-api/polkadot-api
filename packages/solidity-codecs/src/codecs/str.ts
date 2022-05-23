import { enhanceCodec } from "../utils"
import { bytes } from "./bytes"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const base = Object.assign([], bytes)
base.s = "string"

export const str = enhanceCodec<Uint8Array, string>(
  base,
  textEncoder.encode.bind(textEncoder),
  textDecoder.decode.bind(textDecoder),
)
