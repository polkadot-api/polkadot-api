import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

export const i64: Codec<bigint> = createCodec(
  encodeInt(IntType.i64),
  decodeInt(IntType.i64),
)
