import type {
  UnionToIntersection,
  InnerCodecs,
  InnerCodecsOrPayableAmount,
} from "../utils"
import type {
  SolidityFn,
  SolidityError,
  ErrorResult,
  ErrorReader,
} from "../descriptors"
import { errorsEnhancer } from "../descriptors"
import { getTrackingId, logResponse, withOverload } from "../internal"

export type SolidityTxFunctions<
  A extends Array<SolidityFn<any, any, any, any>>,
  E extends Array<SolidityError<any, any>>,
> = UnionToIntersection<
  {
    [K in keyof A]: A[K] extends SolidityFn<any, infer V, any, infer Mutability>
      ? Mutability extends 2
        ? (
            contractAddress: string,
            fromAddress: string,
            overload: K,
            ...args: InnerCodecs<V>
          ) => Promise<ErrorResult<E, string>>
        : Mutability extends 3
        ? (
            contractAddress: string,
            fromAddress: string,
            overload: K,
            ...args: InnerCodecsOrPayableAmount<V>
          ) => Promise<ErrorResult<E, string>>
        : never
      : never
  }[keyof A & number]
>

export type SolidityTxOverload = <
  F extends Array<SolidityFn<any, any, any, any>>,
  E extends Array<SolidityError<any, any>>,
>(
  overloaded: F,
  ...errors: E
) => SolidityTxFunctions<F, E>

export type SolidityTxFunction<
  F extends SolidityFn<any, any, any, 2 | 3>,
  E extends Array<SolidityError<any, any>>,
> = F extends SolidityFn<any, infer I, any, infer P>
  ? P extends 2
    ? (
        contractAddress: string,
        fromAddress: string,
        ...args: InnerCodecs<I>
      ) => Promise<ErrorResult<E, string>>
    : P extends 3
    ? (
        contractAddress: string,
        fromAddress: string,
        ...args: InnerCodecsOrPayableAmount<I>
      ) => Promise<ErrorResult<E, string>>
    : never
  : never

export type SolidityTxSingle = <
  F extends SolidityFn<any, any, any, 2 | 3>,
  E extends Array<SolidityError<any, any>>,
>(
  fn: F,
  ...errors: E
) => SolidityTxFunction<F, E>

export const getTx = (
  request: <T = any>(method: string, args: Array<any>, meta: any) => Promise<T>,
  errorReader: ErrorReader,
  logger?: (msg: any) => void,
): SolidityTxSingle & SolidityTxOverload =>
  withOverload(
    2,
    (
      fn: SolidityFn<any, any, any, 2 | 3>,
      ...errors: Array<SolidityError<any, any>>
    ) => {
      const enhancer = errorsEnhancer(errors, errorReader)

      return (
        contractAddress: string,
        fromAddress: string,
        ...args: any[]
      ): Promise<string> => {
        const type = "eth_sendTransaction"
        const trackingId = getTrackingId()

        const [actualArgs, value] =
          args.length > fn.encoder.size && fn.mutability === 3
            ? [args.slice(0, -1), args.slice(-1)[0]]
            : [args]

        const meta: any = logger && {
          type,
          fn: fn.name,
          args: actualArgs,
          ...(value ? { value } : {}),
          trackingId,
        }

        return enhancer(
          request(
            type,
            [
              {
                to: contractAddress,
                from: fromAddress,
                data: fn.encoder.asHex(...actualArgs),
                ...(value ? { value: "0x" + value.toString(16) } : {}),
              },
            ],
            meta,
          ),
        ).then(...logResponse(meta, logger))
      }
    },
  )
