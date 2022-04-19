import { createCodec, Decoder, Encoder } from "../"
import { toInternalBytes, mergeUint8 } from "../internal"
import { compact } from "./compact"

const textEncoder = new TextEncoder()
const strEnc: Encoder<string> = (str) => {
  const val = textEncoder.encode(str)
  return mergeUint8(compact.enc(val.length), val)
}

const textDecoder = new TextDecoder()
const strDec: Decoder<string> = toInternalBytes((bytes) => {
  let nElements = compact.dec(bytes) as number
  const arr = new Uint8Array(bytes.buffer, bytes.i, nElements)
  bytes.i += nElements
  return textDecoder.decode(arr)
})

export const str = createCodec(strEnc, strDec)
