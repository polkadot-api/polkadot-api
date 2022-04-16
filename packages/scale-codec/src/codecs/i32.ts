import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

export const i32: Codec<number> = createCodec(
  encodeInt(IntType.i32),
  decodeInt(IntType.i32),
)
