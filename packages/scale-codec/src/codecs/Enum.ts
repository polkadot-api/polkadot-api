import { mapObject, mergeUint8 } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../types"
import { toBuffer, createCodec } from "../utils"
import { U8Enc, U8Dec } from "./U8"

export const EnumEnc = <
  O extends { [P in keyof any]: Encoder<any> },
  OT extends {
    [K in keyof O]: O[K] extends Encoder<infer D>
      ? { tag: K; value: D }
      : unknown
  },
>(
  inner: O,
): Encoder<OT[keyof O]> => {
  const keys = Object.keys(inner)
  return ({ tag, value }: any) => {
    const idx = keys.indexOf(tag)
    return mergeUint8(U8Enc(idx), inner[tag](value))
  }
}

export const EnumDec = <
  O extends { [P in keyof any]: Decoder<any> },
  OT extends {
    [K in keyof O]: O[K] extends Decoder<infer D>
      ? { tag: K; value: D }
      : unknown
  },
>(
  inner: O,
): Decoder<OT[keyof O]> => {
  const entries = Object.entries(inner)

  return toBuffer((buffer) => {
    const idx = U8Dec(buffer)
    const [tag, innerDecoder] = entries[idx]
    const innerResult = innerDecoder(buffer)

    return {
      tag,
      value: innerResult,
    } as OT[keyof O]
  })
}

export const Enum = <
  O extends { [P in keyof any]: Codec<any> },
  OT extends {
    [K in keyof O]: O[K] extends Codec<infer D> ? { tag: K; value: D } : unknown
  },
>(
  inner: O,
): Codec<OT[keyof O]> =>
  createCodec<OT[keyof O]>(
    EnumEnc(mapObject(inner, ([encoder]) => encoder) as any) as any,
    EnumDec(mapObject(inner, ([, decoder]) => decoder) as any),
  )
