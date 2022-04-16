import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

const i8Enc = encodeInt(IntType.i8)
const i8Dec = decodeInt(IntType.i8)

export const i8: Codec<number> = createCodec(i8Enc, i8Dec)
