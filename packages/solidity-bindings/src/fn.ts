import { mergeUint8, toHex } from "@unstoppablejs/utils"
import { Tuple, Codec, keccak, Decoder } from "solidity-codecs"

type InnerCodecs<A extends Array<Codec<any>>> = {
  [K in keyof A]: A[K] extends Codec<infer V> ? V : unknown
}

export const solidityFn = <M extends 0 | 1 | 2 | 3, O, A extends Codec<any>[]>(
  name: string,
  inputs: A,
  decoder: Decoder<O>,
  mutability: M,
) => {
  const { enc, s } = Tuple(...inputs)
  const fnHash = keccak(name + s).slice(0, 4)
  const encoder = (...args: InnerCodecs<A>) =>
    mergeUint8(fnHash, enc(args as any))
  encoder.asHex = (...args: InnerCodecs<A>) => toHex(encoder(...args))
  encoder.length = inputs.length

  return {
    encoder,
    decoder,
    mutability,
    name,
  }
}
