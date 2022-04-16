import { Codec } from "../types"
import { decodeInt, encodeInt, IntType } from "../internal"
import { createCodec } from "../utils"

export const i64: Codec<bigint> = createCodec(
  encodeInt(IntType.i64),
  decodeInt(IntType.i64),
)
