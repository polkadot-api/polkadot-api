import { Codec, Decoder, Encoder } from "../types"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"

const u128Enc: Encoder<bigint> = (value) => {
  const result = new Uint8Array(16)
  const dv = new DataView(result.buffer)
  dv.setBigUint64(0, value, true)
  dv.setBigUint64(8, value >> 64n, true)
  return result
}

const u128Dec: Decoder<bigint> = toInternalBytes((input) => {
  const { v, i } = input
  const right = v.getBigUint64(i, true)
  const left = v.getBigUint64(i + 8, true)
  input.i += 16
  return (left << 64n) + right
})

export const u128: Codec<bigint> = createCodec(u128Enc, u128Dec)
