import { Codec } from "../types"
import { enhanceCodec } from "../"
import { u8 } from "./fixed-width-ints"

const booleanToNumber = (value: boolean) => (value ? 1 : 0)

export const bool: Codec<boolean> = enhanceCodec(u8, booleanToNumber, Boolean)
