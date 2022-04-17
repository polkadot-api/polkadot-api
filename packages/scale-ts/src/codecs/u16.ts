import { Codec } from "../types"
import { decodeInt, encodeInt, IntType } from "../internal"
import { createCodec } from "../utils"

const u16Enc = encodeInt(IntType.u16)
const u16Dec = decodeInt(IntType.u16)

export const u16: Codec<number> = createCodec(u16Enc, u16Dec)
