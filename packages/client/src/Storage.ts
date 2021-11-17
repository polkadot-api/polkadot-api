import type { Codec, CodecType } from "@unstoppablejs/scale-codec"
import { mergeUint8, toHex, utf16StrToUtf8Bytes } from "@unstoppablejs/utils"
import type { Client } from "./client"
import { twoX128 } from "./hashes/twoX128"

declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
}

if (!Symbol["observable"]) {
  Object.defineProperty(Symbol, "observable", {
    value: Symbol("observable"),
  })
}

export interface Observer<T> {
  next: (value: T) => void
  error: (err: any) => void
  complete: () => void
}

export interface Unsubscribable {
  unsubscribe(): void
}
export interface Subscribable<T> {
  subscribe(observer: Partial<Observer<T>>): Unsubscribable
}
export interface InteropObservable<T> {
  [Symbol.observable]: () => Subscribable<T>
  subscribe: (
    next: (value: T) => void,
    error?: (e: unknown) => void,
  ) => () => void
}

const getInteropObservable = <T>(
  fn: (observer: {
    next: (value: T) => void
    error: (e: unknown) => void
  }) => () => void,
  namespace: string,
): InteropObservable<T> => {
  const defaulOntError = (e: unknown) => {
    console.log(`An uncaught error ocurred on ${namespace}!`)
    console.error(e)
  }

  const realSubscribe = (
    next: (value: T) => void,
    error: (e: unknown) => void = defaulOntError,
  ): (() => void) => fn({ next, error })

  return {
    subscribe: realSubscribe,
    [Symbol.observable]() {
      return {
        subscribe(
          nextOrObserver: any,
          error: any = Function.prototype,
          complete: any = Function.prototype,
        ) {
          const observer =
            typeof nextOrObserver === "function"
              ? { next: nextOrObserver, error, complete }
              : nextOrObserver

          const unsubscribe = realSubscribe(
            observer.next.bind(observer),
            observer.error.bind(observer),
          )

          return { unsubscribe }
        },
      }
    },
  }
}

type ReturnType<A extends Array<any>, C extends Codec<any>> = A extends []
  ? CodecType<C>
  : CodecType<C> | null

export const Storage = (pallet: string, client: Client) => {
  const palledEncoded = twoX128(utf16StrToUtf8Bytes(pallet))
  return <
    A extends ((x: any) => Uint8Array)[],
    OT extends {
      [K in keyof A]: A[K] extends (x: infer V) => any ? V : unknown
    },
    C extends Codec<any>,
  >(
    item: string,
    result: C,
    ...valueKeys: [...A]
  ) => {
    const palletItemEncoded = mergeUint8(
      palledEncoded,
      twoX128(utf16StrToUtf8Bytes(item)),
    )

    const send = (...args: OT): string =>
      toHex(
        mergeUint8(
          palletItemEncoded,
          ...args.map((val, idx) => valueKeys[idx](val)),
        ),
      )

    const onReceive = (
      input: string | null,
    ): C extends Codec<infer CC> ? CC : unknown =>
      input && (result[1](input) as any)

    const observable = (...args: OT) =>
      getInteropObservable<ReturnType<A, C>>(
        (observer) =>
          client.request<string | null>(
            "state_subscribeStorage",
            [[send(...args)]],
            (data) => {
              try {
                observer.next(onReceive(data))
              } catch (e) {
                observer.error(e)
              }
            },
          ),
        `${pallet}_${item}_${args.join("_")}`,
      )

    const get = (...args: [...OT] | [...args: OT, abortSignal: AbortSignal]) =>
      new Promise<ReturnType<A, C>>((res, rej) => {
        const lastArg = args[args.length - 1]
        const [innerArgs, signal]: [OT, AbortSignal | undefined] = (
          lastArg instanceof AbortSignal
            ? [args.slice(0, -1), lastArg]
            : [args, undefined]
        ) as any

        let active = true
        function onAbort() {
          signal!.removeEventListener("abort", onAbort)
          cb()
          rej(new Error("Aborted Promise!"))
        }
        const cb = client.request<string | null>(
          "state_getStorage",
          [send(...innerArgs)],
          (data) => {
            active = false
            signal?.removeEventListener("abort", onAbort)

            try {
              res(onReceive(data))
            } catch (e) {
              rej(e)
            }
          },
        )

        if (signal && active) signal.addEventListener("abort", onAbort)
      })

    return { observable, get }
  }
}
