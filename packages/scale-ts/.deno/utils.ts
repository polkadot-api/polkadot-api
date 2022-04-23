import type { Codec, Decoder, Encoder } from "./types.ts"

export const createCodec = <T>(
  encoder: Encoder<T>,
  decoder: Decoder<T>,
): Codec<T> => {
  const result = [encoder, decoder] as any
  result.enc = encoder
  result.dec = decoder
  return result
}

export const enhanceEncoder =
  <I, O>(encoder: Encoder<I>, mapper: (value: O) => I): Encoder<O> =>
  (value) =>
    encoder(mapper(value))

export const enhanceDecoder =
  <I, O>(decoder: Decoder<I>, mapper: (value: I) => O): Decoder<O> =>
  (value) =>
    mapper(decoder(value))

export const enhanceCodec = <I, O>(
  [encoder, decoder]: Codec<I>,
  toFrom: (value: O) => I,
  fromTo: (value: I) => O,
): Codec<O> =>
  createCodec(enhanceEncoder(encoder, toFrom), enhanceDecoder(decoder, fromTo))
