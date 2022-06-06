import { mergeUint8, toHex } from "@unstoppablejs/utils"
import { Tuple, Codec, keccak, Decoder } from "solidity-codecs"
import type { Untuple, InnerCodecs } from "../utils"
import { UntupleFn } from "../utils"

export interface SolidityFn<
  N extends string,
  I extends Codec<any>[],
  O,
  M extends 0 | 1 | 2 | 3,
> {
  encoder: {
    (...args: InnerCodecs<I>): Uint8Array
    asHex: (...args: InnerCodecs<I>) => string
    size: number
    _d: (input: Uint8Array) => InnerCodecs<I>
  }
  decoder: Decoder<Untuple<O>>
  mutability: M
  name: N
}

export const solidityFn = <
  N extends string,
  I,
  A extends Codec<any>[],
  M extends 0 | 1 | 2 | 3,
>(
  name: N,
  inputs: A,
  decoder: Codec<I>,
  mutability: M,
): SolidityFn<N, A, I, M> => {
  const { enc, dec, s } = Tuple(...inputs)
  const fnHash = keccak(name + s).slice(0, 4)
  const encoder = (...args: InnerCodecs<A>) =>
    mergeUint8(fnHash, enc(args as any))
  encoder.asHex = (...args: InnerCodecs<A>) => toHex(encoder(...args))
  encoder._d = (input: Uint8Array) => dec(input.slice(4))
  encoder.size = inputs.length

  return {
    encoder,
    decoder: UntupleFn(decoder[1]),
    mutability,
    name,
  }
}

type SolidityFnName<T> = T extends SolidityFn<infer R, any, any, any>
  ? R
  : unknown

export const overloadedFn = <
  First extends SolidityFn<any, any, any, any>,
  F extends SolidityFn<SolidityFnName<First>, any, any, any>[],
>(
  first: First,
  ...args: F
): [First, ...F] => {
  return [first, ...args]
}
