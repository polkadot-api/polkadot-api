import type { Codec } from "@unstoppablejs/scale-codec"
import { EncodedArgument } from "./types"

const uint8ArrayToStr = (input: Uint8Array) => {
  const result = new Array<string>(input.length)
  for (let i = 0; i < input.length; i++)
    result[i] = input[i].toString(16).padStart(2, "0")
  return result.join("")
}

export const createEncodedArgument =
  (fn: (x: Uint8Array) => Uint8Array): EncodedArgument =>
  <T extends Codec<any>>([encoder]: T) =>
  (x: T extends Codec<infer V> ? V : unknown) =>
    uint8ArrayToStr(fn(new Uint8Array(encoder(x))))
