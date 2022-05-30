import { mergeUint8, toHex } from "@unstoppablejs/utils"
import { Tuple, Codec, keccak, Decoder } from "solidity-codecs"
import type { UnionToIntersection, Untuple, InnerCodecs } from "./utils"
import { UntupleFn } from "./utils"

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

type SolidityFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<any, infer V, any, any>
        ? (...args: InnerCodecs<V>) => A[K]
        : never
    }[keyof A & number]
  >

export const fromOverloadedToSolidityFn = <
  F extends Array<SolidityFn<any, any, any, any>>,
>(
  overloaded: F,
  minMutability = 0,
): SolidityFunctions<F> => {
  const fnsByLen = new Map<number, SolidityFn<any, any, any, any>[]>()
  overloaded.forEach((fn) => {
    if (fn.mutability < minMutability) return
    const { size } = fn.encoder
    const arr = fnsByLen.get(size) ?? []
    arr.push(fn)
    fnsByLen.set(size, arr)
  })

  return ((...args: any[]) => {
    const candidates = fnsByLen.get(args.length)!
    if (candidates.length < 2) return candidates[0]
    return candidates.find((c) => {
      try {
        const bytes = c.encoder(...args)
        const bytes2 = c.encoder(...c.encoder._d(bytes))
        return (
          bytes.length === bytes2.length &&
          bytes.every((b, idx) => b === bytes2[idx])
        )
      } catch {
        return false
      }
    })
  }) as any
}
