import { JsonRpcProvider } from "polkadot-api/ws-provider/web"

export interface Interceptor {
  sending?: (ctx: InterceptorContext, msg: string) => void
  receiving?: (ctx: InterceptorContext, msg: string) => void
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
      interceptor.receiving ? interceptor.receiving(ctx, msg) : onMsg(msg),
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
        interceptor.sending ? interceptor.sending(ctx, msg) : inner.send(msg),
      disconnect: inner.disconnect,
    }
  }

  return [wrappedProvider, () => result]
}

export const createStopInterceptor = (ctx: InterceptorContext) => {
  let subscription = ""
  let followingId = ""

  const interceptor: Interceptor = {
    sending(ctx, msgStr) {
      const msg = JSON.parse(msgStr)
      if (msg.method === "chainHead_v1_follow") {
        followingId = msg.id
      }
      ctx.send(msgStr)
    },
    receiving(ctx, msgStr) {
      const msg = JSON.parse(msgStr)
      if (msg.id === followingId) {
        subscription = msg.result
      }
      ctx.receive(msgStr)
    },
  }

  const controller = {
    sendUnfollow: () => {
      ctx.send(
        `{"jsonrpc":"2.0","id":"unfollow-${subscription}","method":"chainHead_v1_unfollow","params":["${subscription}"]}`,
      )
    },
    sendStop: () => {
      ctx.receive(
        `{"jsonrpc":"2.0","method":"chainHead_v1_followEvent","params":{"subscription":"${subscription}","result":{"event":"stop"}}}`,
      )
    },
    stop: () => {
      controller.sendUnfollow()
      controller.sendStop()
    },
  }

  return [interceptor, controller] as const
}

export const combineInterceptors = (
  ...interceptors: Interceptor[]
): Interceptor => {
  const sending = (ctx: InterceptorContext, msg: string, idx: number) => {
    if (idx >= interceptors.length) {
      return ctx.send(msg)
    }
    if (interceptors[idx].sending) {
      interceptors[idx].sending(
        {
          send: (msg) => sending(ctx, msg, idx + 1),
          receive: (msg) => receiving(ctx, msg, idx - 1),
        },
        msg,
      )
    } else {
      sending(ctx, msg, idx + 1)
    }
  }
  const receiving = (ctx: InterceptorContext, msg: string, idx: number) => {
    if (idx < 0) {
      return ctx.receive(msg)
    }
    if (interceptors[idx].receiving) {
      interceptors[idx].receiving(
        {
          send: (msg) => sending(ctx, msg, idx + 1),
          receive: (msg) => receiving(ctx, msg, idx - 1),
        },
        msg,
      )
    } else {
      receiving(ctx, msg, idx - 1)
    }
  }

  return {
    sending: (ctx, msg) => sending(ctx, msg, 0),
    receiving: (ctx, msg) => receiving(ctx, msg, interceptors.length - 1),
  }
}
