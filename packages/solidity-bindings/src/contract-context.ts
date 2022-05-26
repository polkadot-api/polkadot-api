import type { Observable } from "rxjs"
import type { Decoder, StringRecord } from "solidity-codecs"
import type { ProviderContext } from "./provider-context"

export const contractCtx = (
  providerContext: ProviderContext,
  getContractAddress: () => string,
) => {
  const _call = <A extends Array<any>, O>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
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

  const _transaction = <A extends Array<any>>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      mutability: 2 | 3
    },
    fromAddress: string,
    ...args: A
  ): Promise<string> =>
    providerContext.transaction(fn, getContractAddress(), fromAddress, ...args)

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
