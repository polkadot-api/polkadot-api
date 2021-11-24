import { Encoder, Codec } from "../types"
import { createCodec, decodeUInt } from "../utils"

const u16Enc: Encoder<number> = (value) => {
  const tmp = new Uint16Array(1)
  tmp[0] = value
  return new Uint8Array(tmp.buffer)
}

const u16Dec = decodeUInt(2)

export const u16: Codec<number> = createCodec(u16Enc, u16Dec)
