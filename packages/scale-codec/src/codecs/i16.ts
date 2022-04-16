import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

export const i16: Codec<number> = createCodec(
  encodeInt(IntType.i16),
  decodeInt(IntType.i16),
)
