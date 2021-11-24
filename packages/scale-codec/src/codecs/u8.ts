import { Codec, Encoder } from "../types"
import { createCodec, decodeUInt } from "../utils"

const u8Enc: Encoder<number> = (value) => {
  const tmp = new Uint8Array(1)
  tmp[0] = value
  return tmp
}

const u8Dec = decodeUInt(1)

export const u8: Codec<number> = createCodec(u8Enc, u8Dec)
