import type { Codec } from "@unstoppablejs/scale-codec"
import { EncodedArgument } from "./types"

export const createEncodedArgument =
  (fn: (x: Uint8Array) => Uint8Array): EncodedArgument =>
  <T extends Codec<any>>([encoder]: T) =>
  (x: T extends Codec<infer V> ? V : unknown) =>
    fn(encoder(x))
