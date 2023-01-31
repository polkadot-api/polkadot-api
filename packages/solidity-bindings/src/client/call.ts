import type { UnionToIntersection, Untuple, InnerCodecsOrBlock } from "../utils"
import type { SolidityFn } from "../descriptors/fn"
import { withOverload, getTrackingId, logResponse } from "../internal"
import { SolidityError, ErrorResult, errorsEnhancer } from "../descriptors"

export type SolidityCallFunctions<
  A extends Array<SolidityFn<any, any, any, any>>,
  E extends Array<SolidityError<any, any>>,
> = UnionToIntersection<
  {
    [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
      ? (
          contractAddress: string,
          overload: K,
          ...args: InnerCodecsOrBlock<V>
        ) => Promise<ErrorResult<E, Untuple<O>>>
      : never
  }[keyof A & number]
>

export type SolidityCallOverload = <
  F extends Array<SolidityFn<any, any, any, any>>,
  E extends Array<SolidityError<any, any>>,
>(
  overloaded: F,
  ...errors: E
) => SolidityCallFunctions<F, E>

export type SolidityCallFunction<
  F extends SolidityFn<any, any, any, any>,
  E extends Array<SolidityError<any, any>>,
> = F extends SolidityFn<any, infer I, infer O, any>
  ? (
      contractAddress: string,
      ...args: InnerCodecsOrBlock<I>
    ) => Promise<ErrorResult<E, Untuple<O>>>
  : never

export type SolidityCallSingle = <
  F extends SolidityFn<any, any, any, any>,
  E extends Array<SolidityError<any, any>>,
>(
  fn: F,
  ...errors: E
) => SolidityCallFunction<F, E>

export const getCall = (
  request: <T = any>(
    method: string,
    args: Array<any>,
    meta?: any,
  ) => Promise<T>,
  logger?: (msg: any) => void,
): SolidityCallSingle & SolidityCallOverload =>
  withOverload(
    1,
    (
      fn: SolidityFn<any, any, any, any>,
      ...errors: Array<SolidityError<any, any>>
    ) => {
      const enhancer = errorsEnhancer(errors)
      return (contractAddress: string, ...args: any[]) => {
        let [actualArgs, toBlock] =
          args.length > fn.encoder.size
            ? [args.slice(0, -1), args.slice(-1)[0]]
            : [args, "latest"]

        if (typeof toBlock !== "string") {
          toBlock = "0x" + toBlock.toString(16)
        }

        const trackingId = getTrackingId()
        const type = "eth_call"
        let meta: any = logger && {
          type: "eth_call",
          fn: fn.name,
          args: actualArgs,
          trackingId,
        }

        return enhancer(
          request(
            type,
            [
              {
                to: contractAddress,
                data: fn.encoder.asHex(...(actualArgs as any)),
              },
              toBlock,
            ],
            meta,
          ).then(fn.decoder),
        ).then(...logResponse(meta, logger))
      }
    },
  ) as any
