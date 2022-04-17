import { Codec, Decoder, Encoder } from "../types"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"

const i128Enc: Encoder<bigint> = (value) => {
  const result = new Uint8Array(16)
  const dv = new DataView(result.buffer)
  dv.setBigUint64(0, value, true)
  dv.setBigInt64(8, value >> 64n, true)
  return result
}

const i128Dec: Decoder<bigint> = toInternalBytes((input) => {
  const dv = new DataView(input.buffer)
  const right = dv.getBigUint64(input.usedBytes, true)
  const left = dv.getBigInt64(input.usedBytes + 8, true)
  input.useBytes(16)
  return (left << 64n) + right
})

export const i128: Codec<bigint> = createCodec(i128Enc, i128Dec)
