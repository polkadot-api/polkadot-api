import { Decoder, StringRecord } from "solidity-codecs"
import { SolidityFn } from "../../descriptors/fn"
import { ProviderContext } from "../provider"
import type { Codec } from "solidity-codecs"
import type {
  UnionToIntersection,
  Untuple,
  InnerCodecsOrBlock,
  InnerCodecs,
} from "../../utils"
import { Observable } from "rxjs"
import { batcher } from "./batcher"

type SolidityCallFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
        ? (overload: K, ...args: InnerCodecsOrBlock<V>) => Promise<Untuple<O>>
        : never
    }[keyof A & number]
  >

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
              fromAddress: string,
              overload: K,
              ...args: InnerCodecs<V>
            ) => Promise<string>
          : never
        : never
    }[keyof A & number]
  >

export const contractCtx = (
  provider: ProviderContext,
  getContractAddress: () => string,
  batchFn?: SolidityFn<any, [Codec<Uint8Array[]>], Uint8Array[], 2 | 3>,
) => {
  const event = <F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: Partial<F>) => Array<string | null>
    decodeData: Decoder<O>
    decodeFilters: (topics: Array<string>) => F
    name?: string
  }) => {
    const ctx = provider.event(e)

    return (
      eventFilter: Partial<F>,
    ): Observable<{ data: O; filters: F; message: any }> =>
      ctx(eventFilter, getContractAddress())
  }

  let singleCall: <I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, any>,
  ) => (...args: InnerCodecsOrBlock<I>) => Promise<Untuple<O>>

  let singleTx: <I extends Array<Codec<any>>>(
    fn: SolidityFn<any, I, any, any>,
  ) => (fromAddress: string, ...args: InnerCodecs<I>) => Promise<string>

  if (batchFn) {
    const batchedCall = provider.call(batchFn)
    singleCall = batcher(
      (args, fn) =>
        args.length > fn.encoder.size ? args[args.length - 1] : "latest",
      (calls, blockNumber) => {
        if (calls.length === 1) {
          const [{ fn, args, res, rej }] = calls
          provider
            .call(fn)(getContractAddress(), ...args)
            .then(res, rej)
          return
        }
        const data = calls.map(({ args, fn }) => {
          const actualArgs =
            args.length > fn.encoder.size ? args.slice(0, -1) : args
          return fn.encoder(...actualArgs)
        })

        const actualBlock: any = Number.isNaN(parseInt(blockNumber))
          ? blockNumber
          : parseInt(blockNumber)

        batchedCall(getContractAddress(), data, actualBlock).then(
          (responses) => {
            calls.forEach(({ res, fn }, idx) => {
              res(fn.decoder(responses[idx]))
            })
          },
          (e) => {
            calls.forEach(({ rej }) => {
              rej(e)
            })
          },
        )
      },
    )

    const batchedTx = provider.tx(batchFn)
    singleTx = batcher(
      (args) => args[0],
      (calls, from) => {
        if (calls.length === 1) {
          const [{ fn, args, res, rej }] = calls
          provider
            .tx(fn)(getContractAddress(), from, ...args.slice(1))
            .then(res, rej)
          return
        }
        const data = calls.map(({ args, fn }) => {
          const actualArgs = args.slice(1)
          return fn.encoder(...actualArgs)
        })

        batchedTx(getContractAddress(), from, data).then(
          (response) => {
            calls.forEach(({ res }) => {
              res(response)
            })
          },
          (e) => {
            calls.forEach(({ rej }) => {
              rej(e)
            })
          },
        )
      },
    )
  } else {
    singleCall = (fn) => {
      const providerCall = provider.call(fn)
      return (...args) => providerCall(getContractAddress(), ...args)
    }
    singleTx = (fn) => {
      const providerTx = provider.tx(fn)
      return (fromAddress, ...args) =>
        providerTx(getContractAddress(), fromAddress, ...args)
    }
  }

  const overCall = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityCallFunctions<F> =>
    ((overload: number, ...args: any[]) =>
      (singleCall(overloaded[overload]) as any)(...args)) as any

  const call: (<I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, any>,
  ) => (...args: InnerCodecsOrBlock<I>) => Promise<Untuple<O>>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overCall : singleCall) as any)(fn)

  const overTx = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityTxFunctions<F> =>
    ((fromAddress: string, overload: number, ...args: any[]) =>
      (singleTx(overloaded[overload]) as any)(fromAddress, ...args)) as any

  const tx: (<I extends Array<Codec<any>>>(
    fn: SolidityFn<any, I, any, 2 | 3>,
  ) => (fromAddress: string, ...args: InnerCodecs<I>) => Promise<string>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overTx : singleTx) as any)(fn)

  return { event, call, tx }
}

export type ContractContext = ReturnType<typeof contractCtx>
