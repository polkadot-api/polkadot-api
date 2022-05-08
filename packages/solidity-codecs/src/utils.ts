import type { Codec, Decoder, Encoder } from "./types"

export const createCodec = <T>(
  encoder: Encoder<T>,
  decoder: Decoder<T>,
): Codec<T> => {
  const result = [encoder, decoder] as any
  result.enc = encoder
  result.dec = decoder
  return result
}

export const dyn = <T extends { dyn?: boolean }>(
  input: { dyn?: boolean },
  output: T,
): T => {
  if (input.dyn) output.dyn = true
  return output
}

export const enhanceEncoder = <I, O>(
  encoder: Encoder<I>,
  mapper: (value: O) => I,
): Encoder<O> => dyn(encoder, ((value) => encoder(mapper(value))) as Encoder<O>)

export const enhanceDecoder = <I, O>(
  decoder: Decoder<I>,
  mapper: (value: I) => O,
): Decoder<O> => dyn(decoder, ((value) => mapper(decoder(value))) as Decoder<O>)

export const enhanceCodec = <I, O>(
  codec: Codec<I>,
  toFrom: (value: O) => I,
  fromTo: (value: I) => O,
): Codec<O> =>
  dyn(
    codec,
    createCodec(
      enhanceEncoder(codec[0], toFrom),
      enhanceDecoder(codec[1], fromTo),
    ),
  )
