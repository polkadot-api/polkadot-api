import { Codec, Decoder, Encoder } from "../types"
import { createCodec, decodeUInt } from "../utils"

export const u64Enc: Encoder<bigint> = (input) => {
  const result = new Uint8Array(8)
  const dv = new DataView(result.buffer)
  dv.setBigUint64(0, input, true)
  return result
}

export const u64Dec: Decoder<bigint> = decodeUInt(8)
export const u64: Codec<bigint> = createCodec(u64Enc, u64Dec)
