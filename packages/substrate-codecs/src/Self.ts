import { Codec, Decoder, Encoder, createCodec, Struct } from "scale-ts"

export const selfEncoder = <T>(
  value: () => Encoder<T>,
): Encoder<{ self: T }> => {
  let cache: Encoder<{ self: T }> = (x) => {
    const encoder = Struct.enc({ self: value() })
    cache = encoder
    return encoder(x)
  }

  return (x) => cache(x)
}

export const selfDecoder = <T>(
  value: () => Decoder<T>,
): Decoder<{ self: T }> => {
  let cache: Decoder<{ self: T }> = (x) => {
    const decoder = Struct.dec({ self: value() })
    const result = decoder
    cache = decoder
    return result(x)
  }

  return (x) => cache(x)
}

export const Self = <T>(value: () => Codec<T>): Codec<{ self: T }> =>
  createCodec(
    selfEncoder(() => value().enc),
    selfDecoder(() => value().dec),
  )
