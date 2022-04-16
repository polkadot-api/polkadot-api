import { Codec } from "../types"
import { createCodec, decodeInt, encodeInt, IntType } from "../utils"

const u64Enc = encodeInt(IntType.u64)
const u64Dec = decodeInt(IntType.u64)

export const u64: Codec<bigint> = createCodec(u64Enc, u64Dec)
