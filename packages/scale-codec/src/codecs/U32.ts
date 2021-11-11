import { Codec, Encoder } from "../types"
import { createCodec, decodeUInt } from "../utils"

export const U32Enc: Encoder<number> = (value) => {
  const tmp = new Uint32Array(1)
  tmp[0] = value
  return new Uint8Array(tmp.buffer)
}

export const U32Dec = decodeUInt(4)

export const U32: Codec<number> = createCodec(U32Enc, U32Dec)
