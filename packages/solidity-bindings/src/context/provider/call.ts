import type { Codec } from "solidity-codecs"
import type {
  UnionToIntersection,
  Untuple,
  InnerCodecsOrBlock,
} from "../../utils"
import type { SolidityFn } from "../../descriptors/fn"

type SolidityCallFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
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

export const getCall = (
  request: <T = any>(method: string, args: Array<any>) => Promise<T>,
) => {
  const singleCall =
    <I extends Array<Codec<any>>, O>(fn: SolidityFn<any, I, O, any>) =>
    (
      contractAddress: string,
      ...args: InnerCodecsOrBlock<I>
    ): Promise<Untuple<O>> => {
      const [actualArgs, toBlock] =
        args.length > fn.encoder.size
          ? [args.slice(0, -1), args.slice(-1)[0]]
          : [args, "latest"]
      return request("eth_call", [
        { to: contractAddress, data: fn.encoder.asHex(...(actualArgs as any)) },
        toBlock,
      ]).then(fn.decoder)
    }

  const overCall = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityCallFunctions<F> =>
    ((contractAddress: string, overload: number, ...args: any[]) =>
      (singleCall(overloaded[overload]) as any)(
        contractAddress,
        ...args,
      )) as any

  const call: (<I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, any>,
  ) => (
    contractAddress: string,
    ...args: InnerCodecsOrBlock<I>
  ) => Promise<Untuple<O>>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overCall : singleCall) as any)(fn)

  return call
}
