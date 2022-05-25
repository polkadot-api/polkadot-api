import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { concatMap, defer, filter, map, Observable, Subscriber } from "rxjs"
import { Decoder, StringRecord } from "solidity-codecs"

export const contractContext = (
  getProvider: () => JsonRpcProvider,
  getContractAddress: () => string,
) => {
  const subscriptions = new Map<string, Set<Subscriber<any>>>()
  let latestMessage: any = null
  const dispatcher = {
    next: (message: any) => {
      latestMessage = message
      const sub: string = message?.data.subscription
      ;(subscriptions.get(sub) ?? []).forEach((x) => x.next(message.data))
    },
    complete: () => {
      subscriptions.forEach((x) => x.forEach((o) => o.complete()))
    },
  }

  let provider: JsonRpcProvider | null = null
  let onProviderChange: (newProvider: JsonRpcProvider) => void = (
    newProvider,
  ) => {
    provider = newProvider
    messages$.subscribe(dispatcher)
  }

  const messages$ = new Observable<any>((observer) => {
    const innerProvider = provider

    onProviderChange = (newProvider) => {
      if (newProvider === innerProvider) return
      provider = newProvider
      latestMessage = null
      observer.complete()
      messages$.subscribe(dispatcher)
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
      if (latestMessage?.data.subscription === subscriptionId) {
        observer.next(latestMessage.data)
      }

      const subscriptors = subscriptions.get(subscriptionId) ?? new Set()
      subscriptors.add(observer)
      subscriptions.set(subscriptionId, subscriptors)

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

  const innerGetProvider = () => {
    const provider = getProvider()
    onProviderChange(provider)
    return provider
  }

  const request = async <T = any>(
    method: string,
    params: Array<any>,
  ): Promise<T> =>
    innerGetProvider().request({
      method,
      params,
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
        to: getContractAddress(),
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
    defer(() =>
      request("eth_subscribe", [
        "logs",
        {
          address: getContractAddress(),
          topics: e.encodeTopics(eventFilter),
        },
      ]),
    ).pipe(
      concatMap(getSubscription),
      filter((x) => !x?.result?.removed),
      map((x) => e.decodeData(x.result.data)),
    )

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
