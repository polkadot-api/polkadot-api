import { Codec, Decoder, Encoder, StringRecord } from "../types"
import { toInternalBytes, mapObject, mergeUint8 } from "../internal"
import { createCodec, u8 } from "../"

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
): Encoder<OT[keyof O]> => {
  const keys = Object.keys(inner)
  return ({ tag, value }: any) =>
    mergeUint8(u8.enc(keys.indexOf(tag)), (inner as any)[tag](value))
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
): Decoder<OT[keyof O]> => {
  const entries = Object.entries(inner)

  return toInternalBytes((bytes) => {
    const idx = u8.dec(bytes)
    const [tag, innerDecoder] = entries[idx]
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
): Codec<OT[keyof O]> =>
  createCodec<OT[keyof O]>(
    enumEnc(mapObject(inner, ([encoder]) => encoder) as any) as any,
    enumDec(mapObject(inner, ([, decoder]) => decoder) as any),
  )

Enum.enc = enumEnc
Enum.dec = enumDec
