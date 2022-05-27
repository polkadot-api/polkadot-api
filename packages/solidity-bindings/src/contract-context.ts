import type { Observable } from "rxjs"
import type { Decoder, StringRecord } from "solidity-codecs"
import type { ProviderContext } from "./provider-context"

type BatchFn = (args: Uint8Array[]) => Uint8Array

interface CallFn<A extends Array<any>, O> {
  fn: {
    encoder: ((...args: A) => Uint8Array) & {
      asHex: (args: A) => string
    }
    decoder: Decoder<O>
  }
  args: A
}

interface TxFn<A extends Array<any>, O> {
  fn: {
    encoder: ((...args: A) => Uint8Array) & {
      asHex: (...args: A) => string
    }
    decoder: Decoder<O>
    mutability: 2 | 3
  }
  args: A
}

export const contractCtx = (
  providerContext: ProviderContext,
  getContractAddress: () => string,
  batchFn?: {
    encoder: BatchFn & {
      asHex: (args: Uint8Array[]) => string
      size: number
    }
    decoder: Decoder<Uint8Array[]>
    mutability: 2 | 3
  },
) => {
  let batchedCalls: Array<{
    call: CallFn<any, any>
    res: (a: any) => void
    rej: (e: any) => void
  }> = []
  let callsWorker: Promise<void> | null = null

  const _call = batchFn
    ? <A extends Array<any>, O>(
        fn: {
          encoder: ((...args: A) => Uint8Array) & {
            asHex: (args: A) => string
          }
          decoder: Decoder<O>
        },
        ...args: A
      ): Promise<O> => {
        const result = new Promise<O>((res, rej) => {
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
                .call(call.fn, getContractAddress(), ...call.args)
                .then(res)
                .catch(rej)
              return
            }
            const data = reBatched.map(({ call }) =>
              call.fn.encoder(...call.args),
            )
            providerContext.call(batchFn, getContractAddress(), data).then(
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
    : <A extends Array<any>, O>(
        fn: {
          encoder: ((...args: A) => Uint8Array) & {
            asHex: (...args: A) => string
          }
          decoder: Decoder<O>
        },
        ...args: A
      ): Promise<O> => providerContext.call(fn, getContractAddress(), ...args)

  function call<A extends Array<any>, O>(fn: {
    encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
    decoder: Decoder<O>
  }): (...args: A) => Promise<O>
  function call<A extends Array<any>, O>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      decoder: Decoder<O>
    },
    ...args: A
  ): Promise<O>
  function call(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => _call(args[0], ...others)
      : (_call as any)(...args)
  }

  let batchedTransactions: Array<{
    tx: TxFn<any, any>
    from: string
    res: (a: any) => void
    rej: (e: any) => void
  }> = []
  let transactionWorker: Promise<void> | null = null

  const _transaction = batchFn
    ? <A extends Array<any>, O>(
        fn: {
          encoder: ((...args: A) => Uint8Array) & {
            asHex: (...args: A) => string
          }
          decoder: Decoder<O>
          mutability: 2 | 3
        },
        from: string,
        ...args: A
      ): Promise<string> => {
        if (
          batchedTransactions.length &&
          from !== batchedTransactions[0].from
        ) {
          return providerContext.transaction(
            fn,
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
                .transaction(tx.fn, getContractAddress(), from, ...tx.args)
                .then(res)
                .catch(rej)
              return
            }
            const data = reBatched.map(({ tx }) => tx.fn.encoder(...tx.args))
            providerContext
              .transaction(
                batchFn,
                getContractAddress(),
                reBatched[0].from,
                data,
              )
              .then(
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
    : <A extends Array<any>, O>(
        fn: {
          encoder: ((...args: A) => Uint8Array) & {
            asHex: (...args: A) => string
          }
          decoder: Decoder<O>
        },
        ...args: A
      ): Promise<O> => providerContext.call(fn, getContractAddress(), ...args)

  function transaction<A extends Array<any>>(fn: {
    encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
    mutability: 2 | 3
  }): (fromAddress: string, ...args: A) => Promise<string>
  function transaction<A extends Array<any>>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      mutability: 2 | 3
    },
    fromAddress: string,
    ...args: A
  ): Promise<string>
  function transaction(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_transaction as any)(args[0], ...others)
      : (_transaction as any)(...args)
  }

  const _event = <F extends StringRecord<any>, O>(
    e: {
      encodeTopics: (filter: Partial<F>) => Array<string | null>
      decodeData: Decoder<O>
      decodeFilters: (topics: Array<string>) => F
      name?: string
    },
    eventFilter: Partial<F>,
  ): Observable<{ data: O; filters: F; message: any }> =>
    providerContext.event(e, eventFilter, getContractAddress())

  function event<F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: Partial<F>) => Array<string | null>
    decodeData: Decoder<O>
    decodeFilters: (topics: Array<string>) => F
    name?: string
  }): (
    eventFilter: Partial<F>,
  ) => Observable<{ data: O; filters: F; message: any }>
  function event<F extends StringRecord<any>, O>(
    e: {
      encodeTopics: (filter: Partial<F>) => Array<string | null>
      decodeData: Decoder<O>
      decodeFilters: (topics: Array<string>) => F
      name?: string
    },
    eventFilter: Partial<F>,
  ): Observable<{ data: O; filters: F; message: any }>
  function event(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_event as any)(args[0], ...others)
      : (_event as any)(...args)
  }

  return { call, transaction, event }
}

export type ContractContext = ReturnType<typeof contractCtx>
