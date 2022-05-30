import type { Observable } from "rxjs"
import type { Codec, Decoder, StringRecord } from "solidity-codecs"
import type { ProviderContext } from "./provider-context"
import type { Untuple, UnionToIntersection, InnerCodecs } from "./utils"
import type { SolidityFn } from "./fn"
import { fromOverloadedToSolidityFn } from "./fn"

type SolidityCallFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
        ? (...args: InnerCodecs<V>) => Promise<Untuple<O>>
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
          ? (fromAddress: string, ...args: InnerCodecs<V>) => Promise<string>
          : never
        : never
    }[keyof A & number]
  >

interface CallFn<I extends Codec<any>[], O> {
  fn: SolidityFn<any, I, O, any>
  args: InnerCodecs<I>
}

interface TxFn<I extends Codec<any>[], O> {
  fn: SolidityFn<any, I, O, 2 | 3>
  args: InnerCodecs<I>
}

export const contractCtx = (
  providerContext: ProviderContext,
  getContractAddress: () => string,
  batchFn?: SolidityFn<any, [Codec<Uint8Array[]>], Uint8Array[], 2 | 3>,
) => {
  const batchedCall = batchFn ? providerContext.call(batchFn) : null
  const batchedTx = batchFn ? providerContext.transaction(batchFn) : null
  let batchedCalls: Array<{
    call: CallFn<any, any>
    res: (a: any) => void
    rej: (e: any) => void
  }> = []
  let callsWorker: Promise<void> | null = null

  const _call = batchFn
    ? <I extends Codec<any>[], O>(fn: SolidityFn<any, I, O, any>) =>
        (...args: InnerCodecs<I>): Promise<Untuple<O>> => {
          const result = new Promise<Untuple<O>>((res, rej) => {
            batchedCalls.push({
              call: { fn, args },
              res,
              rej,
            })
          })

          if (!callsWorker) {
            callsWorker = Promise.resolve().then(() => {
              const reBatched = [...batchedCalls]
              batchedCalls = []
              callsWorker = null
              if (reBatched.length === 1) {
                const [{ call, res, rej }] = reBatched
                providerContext
                  .call(call.fn)(getContractAddress(), ...call.args)
                  .then(res)
                  .catch(rej)
                return
              }
              const data = reBatched.map(({ call }) =>
                call.fn.encoder(...call.args),
              )
              batchedCall!(getContractAddress(), data).then(
                (responses) => {
                  reBatched.forEach(({ res, call }, idx) => {
                    res(call.fn.decoder(responses[idx]))
                  })
                },
                (e) => {
                  reBatched.forEach(({ rej }) => {
                    rej(e)
                  })
                },
              )
            })
          }

          return result
        }
    : <I extends Array<Codec<any>>, O>(fn: SolidityFn<any, I, O, any>) =>
        (...args: InnerCodecs<I>): Promise<Untuple<O>> =>
          providerContext.call(fn)(getContractAddress(), ...args)

  const overCall = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityCallFunctions<F> => {
    const fns = fromOverloadedToSolidityFn(overloaded)
    return ((...args: any[]) => _call((fns as any)(...args))(...args)) as any
  }

  const call: (<I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, any>,
  ) => (...args: InnerCodecs<I>) => Promise<Untuple<O>>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overCall : _call) as any)(fn)

  let batchedTransactions: Array<{
    tx: TxFn<any, any>
    from: string
    res: (a: any) => void
    rej: (e: any) => void
  }> = []
  let transactionWorker: Promise<void> | null = null

  const _transaction = batchFn
    ? <I extends Codec<any>[], O>(fn: SolidityFn<any, I, O, any>) =>
        (from: string, ...args: InnerCodecs<I>): Promise<string> => {
          if (
            batchedTransactions.length &&
            from !== batchedTransactions[0].from
          ) {
            return providerContext.transaction(fn)(
              getContractAddress(),
              from,
              ...args,
            )
          }

          const result = new Promise<string>((res, rej) => {
            batchedTransactions.push({
              tx: { fn, args },
              from,
              res,
              rej,
            })
          })

          if (!transactionWorker) {
            transactionWorker = Promise.resolve().then(() => {
              const reBatched = [...batchedTransactions]
              batchedTransactions = []
              transactionWorker = null
              if (reBatched.length === 1) {
                const [{ tx, res, rej, from }] = reBatched
                providerContext
                  .transaction(tx.fn)(getContractAddress(), from, ...tx.args)
                  .then(res)
                  .catch(rej)
                return
              }
              const data = reBatched.map(({ tx }) => tx.fn.encoder(...tx.args))
              batchedTx!(getContractAddress(), reBatched[0].from, data).then(
                (response) => {
                  reBatched.forEach(({ res }) => {
                    res(response)
                  })
                },
                (e) => {
                  reBatched.forEach(({ rej }) => {
                    rej(e)
                  })
                },
              )
            })
          }

          return result
        }
    : <I extends Array<Codec<any>>, O>(fn: SolidityFn<any, I, O, any>) =>
        (from: string, ...args: InnerCodecs<I>): Promise<string> =>
          providerContext.transaction(fn)(getContractAddress(), from, ...args)

  const overTx = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityTxFunctions<F> => {
    const fns = fromOverloadedToSolidityFn(overloaded)
    return ((...args: any[]) => _call((fns as any)(...args))(...args)) as any
  }

  const transaction: (<I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, 2 | 3>,
  ) => (fromAddress: string, ...args: InnerCodecs<I>) => Promise<string>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overTx : _transaction) as any)(fn)

  const event = <F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: Partial<F>) => Array<string | null>
    decodeData: Decoder<O>
    decodeFilters: (topics: Array<string>) => F
    name?: string
  }) => {
    const ctx = providerContext.event(e)

    return (
      eventFilter: Partial<F>,
    ): Observable<{ data: O; filters: F; message: any }> =>
      ctx(eventFilter, getContractAddress())
  }

  return { call, transaction, event }
}

export type ContractContext = ReturnType<typeof contractCtx>
