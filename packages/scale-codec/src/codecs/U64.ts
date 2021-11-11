import { Codec, Decoder, Encoder } from "../types"
import { createCodec, toBuffer } from "../utils"

export const U64Enc: Encoder<bigint> = (input) => {
  const result = new Uint8Array(8)
  const dv = new DataView(result.buffer)
  dv.setBigUint64(0, input, true)
  return result
}

export const U64Dec: Decoder<bigint> = toBuffer((buffer) => {
  const value = new DataView(buffer.buffer).getBigUint64(0, true)
  buffer.useBytes(8)
  return value
})

export const U64: Codec<bigint> = createCodec(U64Enc, U64Dec)
