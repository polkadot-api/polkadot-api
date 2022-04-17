import { Codec, Decoder, Encoder } from "../types"
import { createCodec, enhanceDecoder, enhanceEncoder } from "../utils"
import { Tuple } from "./Tuple"
import { Vector } from "./Vector"

const MapCodecEnc = <K, V>(key: Encoder<K>, value: Encoder<V>) =>
  enhanceEncoder(Vector.enc(Tuple.enc(key, value)), (input: Map<K, V>) =>
    Array.from(input.entries()),
  )

const MapCodecDec = <K, V>(key: Decoder<K>, value: Decoder<V>) =>
  enhanceDecoder(
    Vector.dec(Tuple.dec(key, value)),
    (entries) => new Map(entries),
  )

export const MapCodec = <K, V>(
  key: Codec<K>,
  value: Codec<V>,
): Codec<Map<K, V>> =>
  createCodec(MapCodecEnc(key[0], value[0]), MapCodecDec(key[1], value[1]))

MapCodec.enc = MapCodecEnc
MapCodec.dec = MapCodecDec
