import { Codec, Decoder, Encoder } from "../types"
import { mergeUint8, toInternalBytes } from "../internal"
import { createCodec } from "../utils"

const TupleDec = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  ...decoders: A
): Decoder<[...OT]> =>
  toInternalBytes(
    (bytes) => decoders.map((decoder) => decoder(bytes)) as [...OT],
  )

const TupleEnc =
  <
    A extends Array<Encoder<any>>,
    OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
  >(
    ...encoders: A
  ): Encoder<[...OT]> =>
  (values) =>
    mergeUint8(...values.map((value, idx) => encoders[idx](value)))

export const Tuple = <
  A extends Array<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  ...codecs: A
): Codec<[...OT]> =>
  createCodec(
    TupleEnc(...codecs.map(([encoder]) => encoder)),
    TupleDec(...codecs.map(([, decoder]) => decoder)),
  )

Tuple.enc = TupleEnc
Tuple.dec = TupleDec
