import {
  Codec,
  CodecType,
  Decoder,
  DecoderType,
  Encoder,
  EncoderType,
  Enum as ScaleEnum,
  StringRecord,
  createCodec,
} from "scale-ts"
import { mapObject } from "@polkadot-api/utils"
import { Enum } from "@/types/enum"

type Tuple<T, N extends number> = readonly [T, ...T[]] & { length: N }

type Push<T extends any[], V> = [...T, V]

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never

type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

type RestrictedLenTuple<T, O extends StringRecord<any>> = Tuple<
  T,
  TuplifyUnion<keyof O> extends Tuple<any, infer V> ? V : 0
>

const VariantEnc = <O extends StringRecord<Encoder<any>>>(
  ...args: [inner: O, x?: RestrictedLenTuple<number, O>]
): Encoder<
  Enum<{
    [K in keyof O]: EncoderType<O[K]>
  }>
> => {
  const enc = ScaleEnum.enc<O>(...(args as [any, any]))
  return (v) => enc({ tag: v.type, value: v.value })
}

const VariantDec = <O extends StringRecord<Decoder<any>>>(
  ...args: [inner: O, x?: RestrictedLenTuple<number, O>]
): Decoder<
  Enum<{
    [K in keyof O]: DecoderType<O[K]>
  }>
> => {
  const dec = ScaleEnum.dec<O>(...(args as [any, any]))
  return (v) => {
    const { tag, value } = dec(v)
    return Enum(tag as any, value as any) as any
  }
}

export const Variant = <O extends StringRecord<Codec<any>>>(
  inner: O,
  ...args: [indexes?: RestrictedLenTuple<number, O>]
): Codec<
  Enum<{
    [K in keyof O]: CodecType<O[K]>
  }>
> =>
  createCodec(
    VariantEnc(
      mapObject(inner, ([encoder]) => encoder) as StringRecord<
        O[keyof O]["enc"]
      >,
      ...(args as any[]),
    ) as Encoder<
      Enum<{
        [K in keyof O]: CodecType<O[K]>
      }>
    >,
    VariantDec(
      mapObject(inner, ([, decoder]) => decoder) as StringRecord<
        O[keyof O]["dec"]
      >,
      ...(args as any[]),
    ) as Decoder<
      Enum<{
        [K in keyof O]: CodecType<O[K]>
      }>
    >,
  )

Variant.enc = VariantEnc
Variant.dec = VariantDec
