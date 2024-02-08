import { Codec, Decoder, Encoder, createCodec, _void } from "scale-ts"

export const selfEncoder = <T>(value: () => Encoder<T>): Encoder<T> => {
  let cache: Encoder<T> = (x) => {
    const encoder = value()
    cache = encoder
    return encoder(x)
  }

  return (x) => cache(x)
}

export const selfDecoder = <T>(value: () => Decoder<T>): Decoder<T> => {
  let cache: Decoder<T> = (x) => {
    const decoder = value()
    const result = decoder
    cache = decoder
    return result(x)
  }

  return (x) => cache(x)
}

export const Self = <T>(value: () => Codec<T>): Codec<T> =>
  createCodec(
    selfEncoder(() => value().enc),
    selfDecoder(() => value().dec),
  )
