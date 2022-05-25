import { mergeUint8, toHex } from "@unstoppablejs/utils"
import { Tuple, Codec, keccak } from "solidity-codecs"
import { Untuple } from "./untuple"

type InnerCodecs<A extends Array<Codec<any>>> = {
  [K in keyof A]: A[K] extends Codec<infer V> ? V : unknown
}

export const solidityFn = <M extends 0 | 1 | 2 | 3, O, A extends Codec<any>[]>(
  name: string,
  inputs: A,
  decoder: Codec<O>,
  mutability: M,
) => {
  const { enc, s } = Tuple(...inputs)
  const fnHash = keccak(name + s).slice(0, 4)
  const encoder = (...args: InnerCodecs<A>) =>
    mergeUint8(fnHash, enc(args as any))
  encoder.asHex = (...args: InnerCodecs<A>) => toHex(encoder(...args))
  encoder.size = inputs.length

  return {
    encoder,
    decoder: Untuple(decoder[1]),
    mutability,
    name,
  }
}
