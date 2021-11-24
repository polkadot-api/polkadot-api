import { Codec, Decoder, Encoder } from "../types"
import { u8 } from "./u8"

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
): Codec<CustomEnumVal<T>> => u8 as any

U8Enum.enc = <T extends CustomEnum<number>>(
  _input: T,
): Encoder<CustomEnumVal<T>> => u8[0] as any

U8Enum.dec = <T extends CustomEnum<number>>(
  _input: T,
): Decoder<CustomEnumVal<T>> => u8[1] as any
