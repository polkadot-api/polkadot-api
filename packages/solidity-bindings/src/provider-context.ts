import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { Codec, Decoder, StringRecord } from "solidity-codecs"
import { concatMap, defer, filter, map, Observable, Subscriber } from "rxjs"
import type { UnionToIntersection, Untuple, InnerCodecs } from "./utils"
import { fromOverloadedToSolidityFn, SolidityFn } from "./fn"

type SolidityCallFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
        ? (
            contractAddress: string,
            ...args: InnerCodecs<V>
          ) => Promise<Untuple<O>>
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
              contractAddress: string,
              fromAddress: string,
              ...args: InnerCodecs<V>
            ) => Promise<string>
          : never
        : never
    }[keyof A & number]
  >

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

  const event =
    <F extends StringRecord<any>, O>(e: {
      encodeTopics: (filter: Partial<F>) => Array<string | null>
      decodeData: Decoder<O>
      decodeFilters: (topics: Array<string>) => F
      name?: string
    }) =>
    (
      eventFilter: Partial<F>,
      contractAddress?: string,
    ): Observable<{ data: O; filters: F; message: any }> => {
      const options: { topics: (string | null)[]; address?: string } = {
        topics: e.encodeTopics(eventFilter),
      }
      if (contractAddress) options.address = contractAddress
      return subscribe(["logs", options]).pipe(
        filter((x) => !x?.result?.removed),
        map((message) => ({
          data: e.decodeData(message.result.data),
          filters: e.decodeFilters(message.result.topics),
          message,
        })),
      )
    }

  const singleCall =
    <I extends Array<Codec<any>>, O>(fn: SolidityFn<any, I, O, any>) =>
    (contractAddress: string, ...args: InnerCodecs<I>): Promise<Untuple<O>> =>
      request("eth_call", [
        { to: contractAddress, data: fn.encoder.asHex(...args) },
        "latest",
      ]).then(fn.decoder)

  const overCall = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityCallFunctions<F> => {
    const fns = fromOverloadedToSolidityFn(overloaded)
    return ((contractAddress: string, ...args: any[]) =>
      singleCall((fns as any)(...args))(contractAddress, ...args)) as any
  }

  const call: (<I extends Array<Codec<any>>, O>(
    fn: SolidityFn<any, I, O, any>,
  ) => (
    contractAddress: string,
    ...args: InnerCodecs<I>
  ) => Promise<Untuple<O>>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>) = (fn: any) =>
    ((Array.isArray(fn) ? overCall : singleCall) as any)(fn)

  const singleTx =
    <A extends Array<any>>(fn: {
      encoder: ((...args: A) => Uint8Array) & {
        asHex: (...args: A) => string
      }
      mutability: 2 | 3
    }) =>
    (
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

  const overTx = <F extends Array<SolidityFn<any, any, any, any>>>(
    overloaded: F,
  ): SolidityTxFunctions<F> => {
    const fns = fromOverloadedToSolidityFn(overloaded, 2)
    return ((contractAddress: string, fromAddress: string, ...args: any[]) =>
      singleTx((fns as any)(...args))(
        contractAddress,
        fromAddress,
        ...args,
      )) as any
  }

  const transaction: (<I extends Array<Codec<any>>>(
    fn: SolidityFn<any, I, any, 2 | 3>,
  ) => (
    contractAddress: string,
    fromAddress: string,
    ...args: InnerCodecs<I>
  ) => Promise<string>) &
    (<F extends Array<SolidityFn<any, any, any, any>>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>) = ((fn: any) =>
    Array.isArray(fn) ? overTx : singleTx) as any

  return { request, subscribe, event, call, transaction }
}

export type ProviderContext = ReturnType<typeof providerCtx>
