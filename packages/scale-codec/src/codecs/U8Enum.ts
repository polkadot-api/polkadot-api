import { Codec, Decoder, Encoder } from "../types"
import { U8 } from "./U8"

type CustomEnum<T extends number> = {
  [id: string]: T | string
  [x: number]: string
}

type CustomEnumVal<T extends CustomEnum<any>> = T extends CustomEnum<infer V>
  ? V extends number
    ? V
    : unknown
  : unknown

export const U8Enum = <T extends CustomEnum<number>>(
  _input: number extends keyof T[keyof T] ? never : T,
): Codec<CustomEnumVal<T>> => U8 as any

export const U8EnumEnc = <T extends CustomEnum<number>>(
  _input: T,
): Encoder<CustomEnumVal<T>> => U8[0] as any

export const U8EnumDec = <T extends CustomEnum<number>>(
  _input: T,
): Decoder<CustomEnumVal<T>> => U8[1] as any
