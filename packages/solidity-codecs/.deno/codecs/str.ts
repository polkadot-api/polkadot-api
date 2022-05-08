import { enhanceCodec } from "../index.ts"
import { bytes } from "./bytes.ts"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const str = enhanceCodec<Uint8Array, string>(
  bytes,
  textEncoder.encode.bind(textEncoder),
  textDecoder.decode.bind(textDecoder),
)
