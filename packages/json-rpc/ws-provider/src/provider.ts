import {
  getSyncProvider,
  InnerJsonRpcProvider,
} from "@polkadot-api/json-rpc-provider-proxy"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { noop } from "@polkadot-api/utils"
import {
  StatusChange,
  WsJsonRpcProvider,
  WsEvent,
  SocketLoggerFn,
  WebSocketClass,
  Middleware,
} from "./types"
import { withSocket } from "./with-socket"
import { identity } from "rxjs"

export const defaultConfig: {
  timeout: number
  heartbeatTimeout: number
  middleware: Middleware
  onStatusChanged: (status: StatusChange) => void
} = {
  onStatusChanged: noop,
  timeout: 5_000,
  heartbeatTimeout: 40_000,
  middleware: identity,
}

export const getWsProvider = (
  endpoints: string | Array<string>,
  config?: Partial<{
    onStatusChanged: (status: StatusChange) => void
    timeout: number
    heartbeatTimeout: number
    websocketClass: WebSocketClass
    middleware: Middleware
    logger: SocketLoggerFn
  }>,
): WsJsonRpcProvider => {
  const {
    onStatusChanged: _onStatuChanged,
    timeout,
    heartbeatTimeout,
    middleware,
    logger,
  } = {
    ...defaultConfig,
    ...config,
  }
  const actualEndpoints = Array.isArray(endpoints) ? endpoints : [endpoints]

  const WebsocketClass = config?.websocketClass ?? globalThis.WebSocket
  if (!WebsocketClass) throw new Error("Missing WebSocket class")

  let idx = 0
  let switchTo: string | undefined
  let latestSocket: WebSocket | null = null
  let status: StatusChange = { type: WsEvent.CLOSE, event: null }
  let prevUri: string | undefined
  const onStatusChanged = (x: StatusChange) => _onStatuChanged((status = x))

  const socketProvider = middleware(
    withSocket(
      () => {
        prevUri = latestSocket?.url
        const uri = switchTo || actualEndpoints[idx++ % actualEndpoints.length]
        switchTo = undefined
        onStatusChanged({
          type: WsEvent.CONNECTING,
          uri,
        })
        return [
          (latestSocket = new WebsocketClass(uri)),
          () => {
            onStatusChanged({
              type: WsEvent.CONNECTED,
              uri,
            })
          },
        ]
      },
      heartbeatTimeout,
      timeout,
      logger,
    ),
  )

  const provider: InnerJsonRpcProvider = (onMsg, onHalt) =>
    socketProvider(onMsg, (event) => {
      onStatusChanged({
        type: WsEvent.ERROR,
        event,
      })
      onHalt(event)
    })

  const result: JsonRpcProvider = getSyncProvider((onReady) => {
    if (!prevUri || latestSocket!.url !== prevUri) {
      onReady(provider)
      return noop
    }

    const token = setTimeout(onReady, 250, provider)
    return () => {
      clearTimeout(token)
    }
  })

  const switchFn: WsJsonRpcProvider["switch"] = (uri?: string) => {
    if (status.type === WsEvent.CLOSE) return
    switchTo = uri
    if (status.type !== WsEvent.ERROR && latestSocket) latestSocket.close()
  }

  return Object.assign(result, { switch: switchFn, getStatus: () => status })
}
