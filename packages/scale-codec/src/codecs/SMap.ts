import { noop } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../types"
import { createCodec, enhanceCodec } from "../utils"
import { Tuple } from "./Tuple"
import { Vector } from "./Vector"

export const SMap = <K, V>(Key: Codec<K>, Value: Codec<V>): Codec<Map<K, V>> =>
  enhanceCodec(
    Vector(Tuple(Key, Value)),
    (input) => Array.from(input.entries()),
    (entries) => new Map(entries),
  )

export const SMapEnc = <K, V>(
  Key: Encoder<K>,
  Value: Encoder<V>,
): Encoder<Map<K, V>> =>
  SMap(createCodec(Key, noop as any), createCodec(Value, noop as any))[0]

export const SMapDec = <K, V>(
  Key: Decoder<K>,
  Value: Decoder<V>,
): Decoder<Map<K, V>> =>
  SMap(createCodec(noop as any, Key), createCodec(noop as any, Value))[1]
