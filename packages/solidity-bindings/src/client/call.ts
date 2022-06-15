import type { UnionToIntersection, Untuple, InnerCodecsOrBlock } from "../utils"
import type { SolidityFn } from "../descriptors/fn"
import { withOverload } from "../internal"

export type SolidityCallFunctions<
  A extends Array<SolidityFn<any, any, any, any>>,
> = UnionToIntersection<
  {
    [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
      ? (
          contractAddress: string,
          overload: K,
          ...args: InnerCodecsOrBlock<V>
        ) => Promise<Untuple<O>>
      : never
  }[keyof A & number]
>

export type SolidityCallOverload = <
  F extends Array<SolidityFn<any, any, any, any>>,
>(
  overloaded: F,
) => SolidityCallFunctions<F>

export type SolidityCallFunction<F extends SolidityFn<any, any, any, any>> =
  F extends SolidityFn<any, infer I, infer O, any>
    ? (
        contractAddress: string,
        ...args: InnerCodecsOrBlock<I>
      ) => Promise<Untuple<O>>
    : never
export type SolidityCallSingle = <F extends SolidityFn<any, any, any, any>>(
  fn: F,
) => SolidityCallFunction<F>

export const getCall = (
  request: <T = any>(method: string, args: Array<any>) => Promise<T>,
): SolidityCallSingle & SolidityCallOverload =>
  withOverload(
    1,
    (fn: SolidityFn<any, any, any, any>) =>
      (contractAddress: string, ...args: any[]) => {
        const [actualArgs, toBlock] =
          args.length > fn.encoder.size
            ? [args.slice(0, -1), args.slice(-1)[0]]
            : [args, "latest"]

        return request("eth_call", [
          {
            to: contractAddress,
            data: fn.encoder.asHex(...(actualArgs as any)),
          },
          toBlock,
        ]).then(fn.decoder)
      },
  )
