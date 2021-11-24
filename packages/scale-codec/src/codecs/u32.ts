import { Codec, Encoder } from "../types"
import { createCodec, decodeUInt } from "../utils"

export const u32Enc: Encoder<number> = (value) => {
  const tmp = new Uint32Array(1)
  tmp[0] = value
  return new Uint8Array(tmp.buffer)
}

export const u32Dec = decodeUInt(4)

export const u32: Codec<number> = createCodec(u32Enc, u32Dec)
