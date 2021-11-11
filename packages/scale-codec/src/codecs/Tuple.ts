import { mergeUint8 } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../types"
import { createCodec, toBuffer } from "../utils"

export const TupleEnc = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  ...decoders: A
): Decoder<[...OT]> =>
  toBuffer((buffer) => {
    const data: [...OT] = new Array(decoders.length) as any

    decoders.forEach((decoder, idx) => {
      data[idx] = decoder(buffer)
    })

    return data
  })

export const TupleDec =
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
    TupleDec(...codecs.map(([encoder]) => encoder)),
    TupleEnc(...codecs.map(([, decoder]) => decoder)),
  )
