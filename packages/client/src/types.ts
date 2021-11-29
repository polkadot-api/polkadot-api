import type { BaseClient } from "./BaseClientInterface"
export { GetProvider, Provider, ProviderStatus } from "@unstoppablejs/provider"

declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
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

export interface Client extends BaseClient {
  getObservable: <I, O = I>(
    subs: string,
    unsubs: string,
    params: Array<any>,
    mapper?: (data: I) => O,
    namespace?: string,
  ) => InteropObservable<O>
  requestReply: <I, O = I>(
    method: string,
    params: Array<any>,
    mapper?: (data: I) => O,
    subs?: string,
    abortSignal?: AbortSignal,
  ) => Promise<O>
}

export interface RpcError {
  code: number
  message: string
  data?: any
}
