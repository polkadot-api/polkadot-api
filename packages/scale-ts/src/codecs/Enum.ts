import { Codec, Decoder, Encoder, StringRecord } from "../types"
import { toInternalBytes, mapObject, mergeUint8 } from "../internal"
import { createCodec, u8 } from "../"

type Tuple<T, N extends number> = readonly [T, ...T[]] & { length: N }

type Push<T extends any[], V> = [...T, V]

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
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

const enumEnc = <
  O extends StringRecord<Encoder<any>>,
  OT extends {
    [K in keyof O]: O[K] extends Encoder<infer D>
      ? D extends undefined
        ? { tag: K; value?: undefined }
        : { tag: K; value: D }
      : unknown
  },
>(
  inner: O,
  x?: RestrictedLenTuple<number, O>,
): Encoder<OT[keyof O]> => {
  const keys = Object.keys(inner)
  const mappedKeys = new Map<string, number>(
    x?.map((actualIdx, idx) => [keys[idx], actualIdx]) ??
      keys.map((key, idx) => [key, idx]),
  )
  const getKey = (key: string) => mappedKeys.get(key)!

  return ({ tag, value }: any) =>
    mergeUint8(u8.enc(getKey(tag)), (inner as any)[tag](value))
}

const enumDec = <
  O extends StringRecord<Decoder<any>>,
  OT extends {
    [K in keyof O]: O[K] extends Decoder<infer D>
      ? D extends undefined
        ? { tag: K; value?: undefined }
        : { tag: K; value: D }
      : unknown
  },
>(
  inner: O,
  x?: RestrictedLenTuple<number, O>,
): Decoder<OT[keyof O]> => {
  const keys = Object.keys(inner)
  const mappedKeys = new Map<number, string>(
    x?.map((actualIdx, idx) => [actualIdx, keys[idx]]) ??
      keys.map((key, idx) => [idx, key]),
  )

  return toInternalBytes((bytes) => {
    const idx = u8.dec(bytes)
    const tag = mappedKeys.get(idx)!
    const innerDecoder = inner[tag]
    return {
      tag,
      value: innerDecoder(bytes),
    } as OT[keyof O]
  })
}

export const Enum = <
  O extends StringRecord<Codec<any>>,
  OT extends {
    [K in keyof O]: O[K] extends Codec<infer D>
      ? D extends undefined
        ? { tag: K; value?: undefined }
        : { tag: K; value: D }
      : unknown
  },
>(
  inner: O,
  ...args: [indexes?: RestrictedLenTuple<number, O>]
): Codec<OT[keyof O]> =>
  createCodec<OT[keyof O]>(
    enumEnc(
      mapObject(inner, ([encoder]) => encoder) as any,
      ...(args as any[]),
    ) as any,
    enumDec(
      mapObject(inner, ([, decoder]) => decoder) as any,
      ...(args as any[]),
    ),
  )

Enum.enc = enumEnc
Enum.dec = enumDec
