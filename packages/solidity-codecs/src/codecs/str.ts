import { createCodec, Decoder, Encoder } from "../"
import { toInternalBytes, mergeUint8 } from "../internal"
import { Uint } from "./Uint"

const uint256 = Uint(256)
const textEncoder = new TextEncoder()
const strEnc: Encoder<string> = (str) => {
  const val = textEncoder.encode(str)
  const args = [uint256.enc(BigInt(val.length)), val] as const
  const extra = val.length % 32
  if (extra > 0) {
    ;(args as any).push(new Uint8Array(32 - extra))
  }
  return mergeUint8(...args)
}
strEnc.din = true

const textDecoder = new TextDecoder()
const strDec: Decoder<string> = toInternalBytes((bytes) => {
  let nElements = Number(uint256.dec(bytes))
  const dv = new DataView(bytes.buffer, bytes.i, nElements)
  const extra = nElements % 32
  const padding = extra && 32 - extra
  bytes.i += nElements + padding
  return textDecoder.decode(dv)
})
strDec.din = true

export const str = createCodec(strEnc, strDec)
str.din = true
