import {
  Codec,
  CodecType,
  Decoder,
  DecoderType,
  Encoder,
  EncoderType,
  Enum as OEnum,
  StringRecord,
  createCodec,
} from "scale-ts"
import { mapObject } from "@polkadot-api/utils"
import { Enum } from "@/types/enum"
import { withInner } from "./with-inner"

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

const VariantEnc: <O extends StringRecord<Encoder<any>>>(
  inner: O,
  x?: RestrictedLenTuple<number, O> | undefined,
) => Encoder<
  Enum<{
    [K in keyof O]: EncoderType<O[K]>
  }>
> & { inner: O } = (...args) => {
  const enc = OEnum.enc(...(args as [any, any]))
  return withInner((v: any) => enc({ tag: v.type, value: v.value }), args[0])
}

const VariantDec: <O extends StringRecord<Decoder<any>>>(
  inner: O,
  x?: RestrictedLenTuple<number, O> | undefined,
) => Decoder<
  Enum<{
    [K in keyof O]: DecoderType<O[K]>
  }>
> & { inner: O } = (...args) => {
  const dec = OEnum.dec(...(args as [any]))
  return withInner((v: any) => {
    const { tag, value } = dec(v)
    return Enum(tag as any, value as any) as any
  }, args[0])
}

export const Variant: {
  <O extends StringRecord<Codec<any>>>(
    inner: O,
    indexes?: RestrictedLenTuple<number, O> | undefined,
  ): Codec<
    Enum<{
      [K in keyof O]: CodecType<O[K]>
    }>
  > & { inner: O }
  enc: <O_1 extends StringRecord<Encoder<any>>>(
    inner: O_1,
    x?: RestrictedLenTuple<number, O_1> | undefined,
  ) => Encoder<
    Enum<{
      [K in keyof O_1]: EncoderType<O_1[K]>
    }>
  > & { inner: O_1 }
  dec: <O_2 extends StringRecord<Decoder<any>>>(
    inner: O_2,
    x?: RestrictedLenTuple<number, O_2> | undefined,
  ) => Decoder<
    Enum<{
      [K in keyof O_2]: DecoderType<O_2[K]>
    }>
  > & { inner: O_2 }
} = (inner, ...args) =>
  withInner(
    createCodec(
      VariantEnc(
        mapObject(inner, ([encoder]) => encoder) as any,
        ...(args as any[]),
      ),
      VariantDec(
        mapObject(inner, ([, decoder]) => decoder) as any,
        ...(args as any[]),
      ) as any,
    ),
    inner,
  ) as any
Variant.enc = VariantEnc
Variant.dec = VariantDec

export const ScaleEnum: {
  <O extends StringRecord<Codec<any>>>(
    inner: O,
    indexes?: RestrictedLenTuple<number, O> | undefined,
  ): Codec<
    {
      [K in keyof O]: {
        tag: K
        value: CodecType<O[K]>
      }
    }[keyof O]
  > & { inner: O }
  enc: <O_1 extends StringRecord<Encoder<any>>>(
    inner: O_1,
    x?: RestrictedLenTuple<number, O_1> | undefined,
  ) => Encoder<
    {
      [K_1 in keyof O_1]: {
        tag: K_1
        value: EncoderType<O_1[K_1]>
      }
    }[keyof O_1]
  > & { inner: O_1 }
  dec: <O_2 extends StringRecord<Decoder<any>>>(
    inner: O_2,
    x?: RestrictedLenTuple<number, O_2> | undefined,
  ) => Decoder<
    {
      [K_2 in keyof O_2]: {
        tag: K_2
        value: DecoderType<O_2[K_2]>
      }
    }[keyof O_2]
  > & { inner: O_2 }
} = (inner, ...args) => withInner(OEnum(inner, ...(args as any[])), inner)
ScaleEnum.enc = (inner, ...rest) =>
  withInner(OEnum.enc(inner, ...(rest as any[])), inner)
ScaleEnum.dec = (inner, ...rest) =>
  withInner(OEnum.dec(inner, ...(rest as any[])), inner)
