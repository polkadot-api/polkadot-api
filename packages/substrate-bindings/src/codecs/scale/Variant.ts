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

export type ExtractEnumValue<
  T extends { type: string; value?: any },
  K extends string,
> = T extends { type: K; value: infer R } ? R : never

export interface Discriminant<T extends { type: string; value?: any }> {
  is<K extends T["type"]>(
    this: Enum<T>,
    type: K,
  ): this is Enum<{ type: K; value: ExtractEnumValue<T, K> }>
  as<K extends T["type"]>(type: K): ExtractEnumValue<T, K>
}

export type Enum<T extends { type: string; value?: any }> = T & Discriminant<T>

export const _Enum = new Proxy(
  {},
  {
    get(_, prop: string) {
      return (value: string) => (Enum as any)(prop, value)
    },
  },
)

export const Enum: <
  T extends { type: string; value?: any },
  Key extends T["type"],
>(
  type: Key,
  ...args: ExtractEnumValue<T, Key> extends undefined
    ? []
    : [value: ExtractEnumValue<T, Key>]
) => Enum<
  ExtractEnumValue<T, Key> extends undefined
    ? T
    : ExtractEnumValue<T, Key> extends never
      ? T
      : {
          type: Key
          value: ExtractEnumValue<T, Key>
        }
> = ((_type: string, _value: any) => ({
  as: (type: string) => {
    if (type !== _type)
      // TODO: fix error
      throw new Error(`Enum.as(${type}) used with actual type ${_type}`)
    return _value
  },
  is: (type: string) => type === _type,
  type: _type,
  value: _value,
})) as any

const VariantEnc = <O extends StringRecord<Encoder<any>>>(
  ...args: [inner: O, x?: RestrictedLenTuple<number, O>]
): Encoder<
  Enum<
    {
      [K in keyof O]: K extends string
        ? { type: K; value: EncoderType<O[K]> }
        : never
    }[keyof O]
  >
> => {
  const enc = ScaleEnum.enc<O>(...(args as [any, any]))
  return (v) => enc({ tag: v.type, value: v.value })
}

const VariantDec = <O extends StringRecord<Decoder<any>>>(
  ...args: [inner: O, x?: RestrictedLenTuple<number, O>]
): Decoder<
  Enum<
    {
      [K in keyof O]: K extends string
        ? { type: K; value: DecoderType<O[K]> }
        : never
    }[keyof O]
  >
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
  Enum<
    {
      [K in keyof O]: K extends string
        ? { type: K; value: CodecType<O[K]> }
        : never
    }[keyof O]
  >
> =>
  createCodec(
    VariantEnc(
      mapObject(inner, ([encoder]) => encoder) as StringRecord<
        O[keyof O]["enc"]
      >,
      ...(args as any[]),
    ) as Encoder<
      Enum<
        {
          [K in keyof O]: K extends string
            ? { type: K; value: CodecType<O[K]> }
            : never
        }[keyof O]
      >
    >,
    VariantDec(
      mapObject(inner, ([, decoder]) => decoder) as StringRecord<
        O[keyof O]["dec"]
      >,
      ...(args as any[]),
    ) as Decoder<
      Enum<
        {
          [K in keyof O]: K extends string
            ? { type: K; value: CodecType<O[K]> }
            : never
        }[keyof O]
      >
    >,
  )

Variant.enc = VariantEnc
Variant.dec = VariantDec
