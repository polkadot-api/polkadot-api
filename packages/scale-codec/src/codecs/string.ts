import { utf16StrToUtf8Bytes, utf8BytesToUtf16Str } from "@unstoppablejs/utils"
import { enhanceCodec } from "../"
import { Vector } from "./Vector"
import { u8 } from "./u8"

export const string = enhanceCodec(
  Vector(u8, true),
  utf16StrToUtf8Bytes,
  utf8BytesToUtf16Str,
)
