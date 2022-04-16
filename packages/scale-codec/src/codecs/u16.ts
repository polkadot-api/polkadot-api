import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

const u16Enc = encodeInt(IntType.u16)
const u16Dec = decodeInt(IntType.u16)

export const u16: Codec<number> = createCodec(u16Enc, u16Dec)
