import { Bytes, enhanceCodec } from "scale-ts"

export const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const fixedStr = (nBytes: number) =>
  enhanceCodec(
    Bytes(nBytes),
    (str: string) => textEncoder.encode(str),
    (bytes) => textDecoder.decode(bytes),
  )
