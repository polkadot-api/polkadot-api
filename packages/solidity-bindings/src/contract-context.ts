import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { Decoder } from "solidity-codecs"

export const contractContext = (
  getProvider: () => JsonRpcProvider,
  getContractAddress: () => string,
) => {
  const request = async <T = any>(
    method: string,
    [par1, ...other]: Array<any>,
  ): Promise<T> =>
    getProvider().request({
      method,
      params: [{ to: getContractAddress(), ...(par1 || {}) }, ...other],
    })

  const _call = <A extends Array<any>, O>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      decoder: Decoder<O>
    },
    ...args: A
  ): Promise<O> =>
    request("eth_call", [
      {
        data: fn.encoder.asHex(...args),
      },
      "latest",
    ]).then(fn.decoder)

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
    request("eth_sendTransaction", [
      { from: fromAddress, data: fn.encoder.asHex(...args) },
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

  return { call, transaction }
}
