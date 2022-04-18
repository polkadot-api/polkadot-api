import { mapObject } from "../internal"
import { Codec, Decoder, Encoder, StringRecord } from "../types"
import { createCodec, enhanceDecoder, enhanceEncoder } from "../utils"
import { Tuple } from "./Tuple"

const StructEnc = <
  A extends StringRecord<Encoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
>(
  encoders: A,
): Encoder<OT> => {
  const keys = Object.keys(encoders)
  return enhanceEncoder(Tuple.enc(...Object.values(encoders)), (input: OT) =>
    keys.map((k) => input[k]),
  )
}

const StructDec = <
  A extends StringRecord<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  decoders: A,
): Decoder<OT> => {
  const keys = Object.keys(decoders)
  return enhanceDecoder(
    Tuple.dec(...Object.values(decoders)),
    (tuple: Array<any>) =>
      Object.fromEntries(tuple.map((value, idx) => [keys[idx], value])) as OT,
  )
}

export const Struct = <
  A extends StringRecord<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  codecs: A,
): Codec<OT> =>
  createCodec(
    StructEnc(mapObject(codecs, (x) => x[0]) as any),
    StructDec(mapObject(codecs, (x) => x[1]) as any),
  )

Struct.enc = StructEnc
Struct.dec = StructDec
