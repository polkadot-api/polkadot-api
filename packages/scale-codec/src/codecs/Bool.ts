import { U8 } from "./U8"
import { Codec, Decoder, Encoder } from "../types"
import { enhanceCodec } from "../utils"

const booleanToNumber = (value: boolean) => (value ? 1 : 0)
const numberToBoolean = (value: number) => value === 1

export const Bool: Codec<boolean> = enhanceCodec(
  U8,
  booleanToNumber,
  numberToBoolean,
)

export const BoolEnc: Encoder<boolean> = Bool[0]
export const BoolDec: Decoder<boolean> = Bool[1]
