import { mapObject } from "../internal/index.ts"
import { Codec, Decoder, Encoder, StringRecord } from "../types.ts"
import { createCodec, enhanceDecoder, enhanceEncoder } from "../utils.ts"
import { tuple } from "./tuple.ts"

const structEnc = <
  A extends StringRecord<Encoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
>(
  encoders: A,
): Encoder<OT> => {
  const keys = Object.keys(encoders)
  return enhanceEncoder(tuple.enc(...Object.values(encoders)), (input: OT) =>
    keys.map((k) => input[k]),
  )
}

const structDec = <
  A extends StringRecord<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
>(
  decoders: A,
): Decoder<OT> => {
  const keys = Object.keys(decoders)
  return enhanceDecoder(
    tuple.dec(...Object.values(decoders)),
    (tuple: Array<any>) =>
      Object.fromEntries(tuple.map((value, idx) => [keys[idx], value])) as OT,
  )
}

export const struct = <
  A extends StringRecord<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
>(
  codecs: A,
): Codec<OT> =>
  createCodec(
    structEnc(mapObject(codecs, (x) => x[0]) as any),
    structDec(mapObject(codecs, (x) => x[1]) as any),
  )

struct.enc = structEnc
struct.dec = structDec
