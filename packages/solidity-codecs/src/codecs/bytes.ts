import { mergeUint8 } from "@unstoppablejs/utils"
import { createCodec, Decoder, Encoder } from "../"
import { toInternalBytes } from "../internal"
import { uint } from "./Uint"

const bytesEnc: Encoder<Uint8Array> = (val) => {
  const args = [uint[0](BigInt(val.length)), val] as const
  const extra = val.length % 32
  if (extra > 0) {
    ;(args as any).push(new Uint8Array(32 - extra))
  }
  return mergeUint8(...args)
}
bytesEnc.dyn = true

const bytesDec: Decoder<Uint8Array> = toInternalBytes((bytes) => {
  let nElements = Number(uint[1](bytes))
  const result = new Uint8Array(bytes.buffer, bytes.i, nElements)
  bytes.i += nElements
  const extra = nElements % 32
  if (extra > 0) bytes.i += 32 - extra
  return result
})
bytesDec.dyn = true

export const bytes = createCodec(bytesEnc, bytesDec)
bytes.dyn = true
