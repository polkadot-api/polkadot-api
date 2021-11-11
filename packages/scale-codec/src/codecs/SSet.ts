import { noop } from "@unstoppablejs/utils"
import { Codec, Decoder, Encoder } from "../types"
import { createCodec, enhanceCodec } from "../utils"
import { Vector } from "./Vector"

export const SSet = <V>(Value: Codec<V>): Codec<Set<V>> =>
  enhanceCodec(
    Vector(Value),
    (input) => Array.from(input.values()),
    (entries) => new Set(entries),
  )

export const SSetEnc = <V>(Value: Encoder<V>): Encoder<Set<V>> =>
  SSet(createCodec(Value, noop as any))[0]

export const SSetDec = <V>(Value: Decoder<V>): Decoder<Set<V>> =>
  SSet(createCodec(noop as any, Value))[1]
