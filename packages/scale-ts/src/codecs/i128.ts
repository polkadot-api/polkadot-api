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

const i128Dec: Decoder<bigint> = toInternalBytes((bytes) => {
  const { v, i } = bytes
  const right = v.getBigUint64(i, true)
  const left = v.getBigInt64(i + 8, true)
  bytes.i += 16
  return (left << 64n) + right
})

export const i128: Codec<bigint> = createCodec(i128Enc, i128Dec)
