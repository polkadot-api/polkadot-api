import type { Codec } from "@unstoppablejs/scale-codec"

export type EncodedArgument = <T extends Codec<any>>([encoder]: T) => (
  input: T extends Codec<infer V> ? V : unknown,
) => Uint8Array

export type EncodedArgs<A extends any[]> = {
  [K in keyof A]: (x: A[K]) => Uint8Array
}
