import type { Codec, Decoder, Encoder } from "./types"
import { createCodec } from "./internal"
import { keccak_256 } from "@noble/hashes/sha3"

export const keccak = keccak_256

const dyn = <T extends { d?: boolean; s: string }>(
  input: { d?: boolean; s: string },
  output: T,
): T => {
  if (input.d) output.d = true
  output.s = input.s
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
      codec.s,
    ),
  )
