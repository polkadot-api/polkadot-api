import { utf16StrToUtf8Bytes, utf8BytesToUtf16Str } from "@unstoppablejs/utils"
import { enhanceCodec } from "../"
import { U8 } from "./U8"
import { Vector } from "./Vector"

export const Str = enhanceCodec(
  Vector(U8),
  (input: string) => Array.from(utf16StrToUtf8Bytes(input)),
  (input: number[]) => utf8BytesToUtf16Str(new Uint8Array(input)),
)

export const StrEnc = Str[0]
export const StrDec = Str[1]
