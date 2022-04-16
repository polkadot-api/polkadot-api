import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

const u8Enc = encodeInt(IntType.u8)
const u8Dec = decodeInt(IntType.u8)

export const u8: Codec<number> = createCodec(u8Enc, u8Dec)
