import { Codec } from "solidity-codecs"

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type InnerCodecs<A extends Array<Codec<any>>> = {
  [K in keyof A]: A[K] extends Codec<infer V> ? V : unknown
}

export type InnerCodecsOrBlock<A extends Array<Codec<any>>> =
  | InnerCodecs<A>
  | [
      ...args: InnerCodecs<A>,
      blockNumber: number | "latest" | "earliest" | "pending",
    ]

export type InnerCodecsOrPayableAmount<A extends Array<Codec<any>>> =
  | InnerCodecs<A>
  | [...args: InnerCodecs<A>, payableAmount: bigint]
