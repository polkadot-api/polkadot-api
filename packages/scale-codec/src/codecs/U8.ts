import { Codec, Encoder } from "../types"
import { createCodec, decodeUInt } from "../utils"

export const U8Enc: Encoder<number> = (value) => {
  const tmp = new Uint8Array(1)
  tmp[0] = value
  return tmp
}

export const U8Dec = decodeUInt(1)

export const U8: Codec<number> = createCodec(U8Enc, U8Dec)
