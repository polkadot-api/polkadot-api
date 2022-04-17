import { Codec } from "../types"
import { decodeInt, encodeInt, IntType } from "../internal"
import { createCodec } from "../utils"

export const i16: Codec<number> = createCodec(
  encodeInt(IntType.i16),
  decodeInt(IntType.i16),
)
