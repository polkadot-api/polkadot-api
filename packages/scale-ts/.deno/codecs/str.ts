import { createCodec, Decoder, Encoder } from "../index.ts"
import { toInternalBytes, mergeUint8 } from "../internal/index.ts"
import { compact } from "./compact.ts"

const textEncoder = new TextEncoder()
const strEnc: Encoder<string> = (str) => {
  const val = textEncoder.encode(str)
  return mergeUint8(compact.enc(val.length), val)
}

const textDecoder = new TextDecoder()
const strDec: Decoder<string> = toInternalBytes((bytes) => {
  let nElements = compact.dec(bytes) as number
  const dv = new DataView(bytes.buffer, bytes.i, nElements)
  bytes.i += nElements
  return textDecoder.decode(dv)
})

export const str = createCodec(strEnc, strDec)
