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
  ): Promise<O> =>
    providerContext
      .request("eth_call", [
        {
          to: getContractAddress(),
          data: fn.encoder.asHex(...args),
        },
        "latest",
      ])
      .then(fn.decoder)

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
    providerContext.request("eth_sendTransaction", [
      {
        to: getContractAddress(),
        from: fromAddress,
        data: fn.encoder.asHex(...args),
      },
    ])

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
      encodeTopics: (filter: F) => Array<string | null>
      decodeData: Decoder<O>
      name?: string
    },
    eventFilter: F,
  ): Observable<O> =>
    providerContext.event(e, eventFilter, getContractAddress())

  function event<F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: F) => Array<string | null>
    decodeData: Decoder<O>
    name?: string
  }): (eventFilter: F) => Observable<O>
  function event<F extends StringRecord<any>, O>(
    e: {
      encodeTopics: (filter: F) => Array<string | null>
      decodeData: Decoder<O>
      name?: string
    },
    eventFilter: F,
  ): Observable<O>
  function event(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_event as any)(args[0], ...others)
      : (_event as any)(...args)
  }

  return { call, transaction, event }
}

export type ContractContext = ReturnType<typeof contractCtx>
