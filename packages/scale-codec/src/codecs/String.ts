import { utf16StrToUtf8Bytes, utf8BytesToUtf16Str } from "@unstoppablejs/utils"
import { enhanceCodec } from "../"
import { U8 } from "./U8"
import { Vector } from "./Vector"

export const Str = enhanceCodec(
  Vector(U8, true),
  utf16StrToUtf8Bytes,
  utf8BytesToUtf16Str,
)

export const StrEnc = Str[0]
export const StrDec = Str[1]
