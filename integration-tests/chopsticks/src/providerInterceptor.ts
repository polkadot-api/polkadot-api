import { JsonRpcProvider } from "polkadot-api/ws-provider/web"

export interface Interceptor {
  sending?: (msg: string) => void
  receiving?: (msg: string) => void
}

export type InterceptorContext = {
  send: (msg: string) => void
  receive: (msg: string) => void
}

export const providerInterceptor = <T>(
  provider: JsonRpcProvider,
  createInterceptor: (ctx: InterceptorContext) => readonly [Interceptor, T],
): [JsonRpcProvider, () => T] => {
  let result: T = null as any

  const wrappedProvider: JsonRpcProvider = (onMsg) => {
    let interceptor: Interceptor = {}

    const inner = provider((msg) =>
      interceptor.receiving ? interceptor.receiving(msg) : onMsg(msg),
    )
    const ctx = {
      send: inner.send,
      receive: onMsg,
    }
    const r = createInterceptor(ctx)
    interceptor = r[0]
    result = r[1]

    return {
      send: (msg) =>
        interceptor.sending ? interceptor.sending(msg) : inner.send(msg),
      disconnect: inner.disconnect,
    }
  }

  return [wrappedProvider, () => result]
}
