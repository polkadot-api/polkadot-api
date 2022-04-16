import { Codec } from "../types"
import { decodeInt, encodeInt, IntType } from "../internal"
import { createCodec } from "../utils"

export const i32: Codec<number> = createCodec(
  encodeInt(IntType.i32),
  decodeInt(IntType.i32),
)
