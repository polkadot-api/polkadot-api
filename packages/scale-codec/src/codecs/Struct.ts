import { mapObject, noop } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../types"
import { createCodec, enhanceCodec } from "../utils"
import { Tuple } from "./Tuple"

export const Struct = <
  A extends Record<string, Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  codecs: A,
): Codec<OT> => {
  const keys = Object.keys(codecs)
  const structToTuple = (input: OT) => keys.map((k) => input[k])

  const tupleToStruct: any = (tuple: Array<any>) =>
    Object.fromEntries(tuple.map((value, idx) => [keys[idx], value]))

  return enhanceCodec(
    Tuple(...Object.values(codecs)),
    structToTuple,
    tupleToStruct,
  ) as Codec<OT>
}

export const StructEnc = <
  A extends Record<string, Encoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
>(
  encoders: A,
): Encoder<OT> =>
  Struct(
    mapObject(encoders, (enc) => createCodec(enc, noop as any) as Codec<any>),
  )[0]

export const StructDec = <
  A extends Record<string, Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  decoders: A,
): Decoder<OT> =>
  Struct(mapObject(decoders, (dec) => createCodec(noop as any, dec)))[1] as any
