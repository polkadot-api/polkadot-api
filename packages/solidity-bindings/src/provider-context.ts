import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import type { Decoder, StringRecord } from "solidity-codecs"
import { concatMap, defer, filter, map, Observable, Subscriber } from "rxjs"

export const providerCtx = (getProvider: () => JsonRpcProvider) => {
  const subscriptions = new Map<string, Set<Subscriber<any>>>()
  let latestMessage: any = null
  const dispatcher = {
    next: (message: any) => {
      latestMessage = message
      const sub: string = message?.data.subscription
      ;(subscriptions.get(sub) ?? []).forEach((x) => x.next(message.data))
    },
    complete: () => {
      ;[...subscriptions.values()].forEach((x) =>
        [...x].forEach((o) => o.complete()),
      )
    },
  }

  let provider: JsonRpcProvider | null = null
  let onProviderChange: (newProvider: JsonRpcProvider) => JsonRpcProvider = (
    newProvider,
  ): JsonRpcProvider => {
    provider = newProvider
    messages$.subscribe(dispatcher)
    return provider!
  }

  const messages$ = new Observable<any>((observer) => {
    const innerProvider = provider

    onProviderChange = (newProvider) => {
      if (newProvider === innerProvider) return newProvider
      provider = newProvider
      latestMessage = null
      observer.complete()
      messages$.subscribe(dispatcher)
      return newProvider!
    }

    const next = observer.next.bind(observer)
    ;(innerProvider as any).addListener("message", next)
    return () => {
      try {
        ;(innerProvider as any).removeListener("message", next)
      } catch (_) {}
    }
  })

  const getSubscription = (subscriptionId: string) =>
    new Observable<any>((observer) => {
      const subscriptors = subscriptions.get(subscriptionId) ?? new Set()
      subscriptors.add(observer)
      subscriptions.set(subscriptionId, subscriptors)

      if (latestMessage?.data.subscription === subscriptionId) {
        observer.next(latestMessage.data)
      }

      return () => {
        subscriptors.delete(observer)
        if (
          subscriptors.size === 0 &&
          subscriptions.get(subscriptionId) === subscriptors
        ) {
          subscriptions.delete(subscriptionId)
        }
      }
    })

  const request = async <T = any>(
    method: string,
    params: Array<any>,
  ): Promise<T> =>
    onProviderChange(getProvider()).request({
      method,
      params,
    })

  const subscribe = <T = any>(params: Array<any>): Observable<T> => {
    return defer(() => request("eth_subscribe", params)).pipe(
      concatMap(getSubscription),
    )
  }

  const _event = <F extends StringRecord<any>, O>(
    e: {
      encodeTopics: (filter: Partial<F>) => Array<string | null>
      decodeData: Decoder<O>
      name?: string
    },
    eventFilter: Partial<F>,
    contractAddress?: string,
  ): Observable<O> => {
    const options: { topics: (string | null)[]; address?: string } = {
      topics: e.encodeTopics(eventFilter),
    }
    if (contractAddress) options.address = contractAddress
    return subscribe(["logs", options]).pipe(
      filter((x) => !x?.result?.removed),
      map((x) => e.decodeData(x.result.data)),
    )
  }

  function event<F extends StringRecord<any>, O>(e: {
    encodeTopics: (filter: Partial<F>) => Array<string | null>
    decodeData: Decoder<O>
    name?: string
  }): (eventFilter: Partial<F>, contractAddress?: string) => Observable<O>
  function event<F extends StringRecord<any>, O>(
    e: {
      encodeTopics: (filter: Partial<F>) => Array<string | null>
      decodeData: Decoder<O>
      name?: string
    },
    eventFilter: Partial<F>,
    contractAddress?: string,
  ): Observable<O>
  function event(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_event as any)(args[0], ...others)
      : (_event as any)(...args)
  }

  const _call = <A extends Array<any>, O>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      decoder: Decoder<O>
    },
    contractAddress: string,
    ...args: A
  ): Promise<O> =>
    request("eth_call", [
      {
        to: contractAddress,
        data: fn.encoder.asHex(...args),
      },
      "latest",
    ]).then(fn.decoder)

  function call<A extends Array<any>, O>(fn: {
    encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
    decoder: Decoder<O>
  }): (contractAddress: string, ...args: A) => Promise<O>
  function call<A extends Array<any>, O>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      decoder: Decoder<O>
    },
    contractAddress: string,
    ...args: A
  ): Promise<O>
  function call(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_call as any)(args[0], ...others)
      : (_call as any)(...args)
  }

  const _transaction = <A extends Array<any>>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      mutability: 2 | 3
    },
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

  function transaction<A extends Array<any>>(fn: {
    encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
    mutability: 2 | 3
  }): (
    contractAddress: string,
    fromAddress: string,
    ...args: A
  ) => Promise<string>
  function transaction<A extends Array<any>>(
    fn: {
      encoder: ((...args: A) => Uint8Array) & { asHex: (...args: A) => string }
      mutability: 2 | 3
    },
    contractAddress: string,
    fromAddress: string,
    ...args: A
  ): Promise<string>
  function transaction(...args: any[]) {
    return args.length === 1
      ? (...others: any[]) => (_transaction as any)(args[0], ...others)
      : (_transaction as any)(...args)
  }

  return { request, subscribe, event, call, transaction }
}

export type ProviderContext = ReturnType<typeof providerCtx>
