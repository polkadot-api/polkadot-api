import { Codec, Decoder, Encoder } from "../types"
import { createCodec, enhanceDecoder, enhanceEncoder } from "../utils"
import { Vector } from "./Vector"

const SetEnc = <V>(value: Encoder<V>) =>
  enhanceEncoder(Vector.enc(value), (input: Set<V>) => Array.from(input))

const SetDec = <V>(value: Decoder<V>) =>
  enhanceDecoder(Vector.dec(value), (input: Array<V>) => new Set(input))

export const SetCodec = <V>(value: Codec<V>): Codec<Set<V>> =>
  createCodec(SetEnc(value[0]), SetDec(value[1]))

SetCodec.enc = SetEnc
SetCodec.dec = SetDec
