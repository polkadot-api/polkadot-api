import { Codec } from "../types"
import { decodeInt, encodeInt, IntType } from "../internal"
import { createCodec } from "../utils"

const u64Enc = encodeInt(IntType.u64)
const u64Dec = decodeInt(IntType.u64)

export const u64: Codec<bigint> = createCodec(u64Enc, u64Dec)
