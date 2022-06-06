import { Codec } from "solidity-codecs"
import type { UnionToIntersection, InnerCodecs } from "../../utils"
import { SolidityFn } from "../../descriptors/fn"

type SolidityTxFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<
        any,
        infer V,
        any,
        infer Mutability
      >
        ? Mutability extends 2 | 3
          ? (
              contractAddress: string,
              fromAddress: string,
              overload: K,
              ...args: InnerCodecs<V>
            ) => Promise<string>
          : never
        : never
    }[keyof A & number]
  >

export const getTx = (
  request: <T = any>(method: string, args: Array<any>) => Promise<T>,
) => {
  const singleTx =
    <A extends Array<any>>(fn: {
      encoder: ((...args: A) => Uint8Array) & {
        asHex: (...args: A) => string
      }
      mutability: 2 | 3
    }) =>
    (
      contractAddress: string,
      fromAddress: string,
      ...args: A
    ): Promise<string> =>
      request("eth_sendTransaction", [
        {
          to: contractAddress,
          from: fromAddress,
          data: fn.encoder.asHex(...args),
        },
      ])

  const overTx = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityTxFunctions<F> =>
    ((
      contractAddress: string,
      fromAddress: string,
      overload: number,
      ...args: any[]
    ) =>
      (singleTx(overloaded[overload]) as any)(
        contractAddress,
        fromAddress,
        ...args,
      )) as any

  const transaction: (<I extends Array<Codec<any>>>(
    fn: SolidityFn<any, I, any, 2 | 3>,
  ) => (
    contractAddress: string,
    fromAddress: string,
    ...args: InnerCodecs<I>
  ) => Promise<string>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overTx : singleTx) as any)(fn)

  return transaction
}
