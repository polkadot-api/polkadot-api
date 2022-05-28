import { mergeUint8 } from "@unstoppablejs/utils"
import type { Decoder, Encoder } from "../types"
import { toInternalBytes, createCodec } from "../internal"
import { uint } from "./Uint"

const bytesEnc = ((val) => {
  const args = [uint[0](BigInt(val.length)), val] as const
  const extra = val.length % 32
  if (extra > 0) {
    ;(args as any).push(new Uint8Array(32 - extra))
  }
  return mergeUint8(...args)
}) as Encoder<Uint8Array>
bytesEnc.d = true

const bytesDec: Decoder<Uint8Array> = toInternalBytes((bytes) => {
  let nElements = Number(uint[1](bytes))
  const result = new Uint8Array(
    bytes.buffer.slice(bytes.i, bytes.i + nElements),
  )
  bytes.i += nElements
  const extra = nElements % 32
  if (extra > 0) bytes.i += 32 - extra
  return result
})
bytesDec.d = true

export const bytes = createCodec(bytesEnc, bytesDec, "bytes")
bytes.d = true
