import { Encoder, Codec } from "../types"
import { createCodec, decodeUInt } from "../utils"

export const U16Enc: Encoder<number> = (value) => {
  const tmp = new Uint16Array(1)
  tmp[0] = value
  return new Uint8Array(tmp.buffer)
}

export const U16Dec = decodeUInt(2)

export const U16: Codec<number> = createCodec(U16Enc, U16Dec)
