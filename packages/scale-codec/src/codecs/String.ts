import { enhanceCodec } from "../"
import { U8 } from "./U8"
import { Vector } from "./Vector"

const fromStringToBytes = (value: string) =>
  value.split("").map((_, idx) => value.charCodeAt(idx))

const fromBytesToString = (bytes: number[]) => String.fromCharCode(...bytes)

export const Str = enhanceCodec(
  Vector(U8),
  fromStringToBytes,
  fromBytesToString,
)

export const StrEnc = Str[0]
export const StrDec = Str[1]
