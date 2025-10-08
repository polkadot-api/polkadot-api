import {
  AsyncJsonRpcProvider,
  getSyncProvider,
} from "@polkadot-api/json-rpc-provider-proxy"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { noop } from "@polkadot-api/utils"
import { StatusChange, WsJsonRpcProvider, WsEvent } from "./types-common"
import { WebSocketClass } from "./types-new"
import { withSocket } from "./with-socket"
import { midleware } from "./middleware"

export const defaultConfig: {
  onStatusChanged: (status: StatusChange) => void
  innerEnhancer: (input: JsonRpcProvider) => JsonRpcProvider
  timeout: number
  heartbeatTimeout: number
} = {
  onStatusChanged: noop,
  innerEnhancer: (x: JsonRpcProvider) => x,
  timeout: 5_000,
  heartbeatTimeout: 40_000,
}

export const mapEndpoints = (
  endpoints: Array<string | { uri: string; protocol: string | string[] }>,
): Array<[string, string | string[]] | [string]> =>
  endpoints.map((x) => (typeof x === "string" ? [x] : [x.uri, x.protocol]))

export const getWsProvider = (
  endpoints:
    | string
    | Array<string | { uri: string; protocol: string | string[] }>,
  config?: Partial<{
    onStatusChanged: (status: StatusChange) => void
    innerEnhancer: (input: JsonRpcProvider) => JsonRpcProvider
    timeout: number
    heartbeatTimeout: number
    websocketClass: WebSocketClass
  }>,
): WsJsonRpcProvider => {
  const {
    onStatusChanged: _onStatuChanged,
    timeout,
    innerEnhancer,
    heartbeatTimeout,
  } = {
    ...defaultConfig,
    ...config,
  }
  const actualEndpoints = mapEndpoints(
    Array.isArray(endpoints) ? endpoints : [endpoints],
  )
  const WebsocketClass = config?.websocketClass ?? globalThis.WebSocket
  if (!WebsocketClass) throw new Error("Missing WebSocket class")

  let idx = 0
  let switchTo: [string] | [string, string | string[]] | null = null
  let latestSocket: WebSocket | null = null
  let status: StatusChange = { type: WsEvent.CLOSE, event: null }
  const onStatusChanged = (x: StatusChange) => _onStatuChanged((status = x))

  const enhanced =
    (input: AsyncJsonRpcProvider): AsyncJsonRpcProvider =>
    (onMsg, onHalt) =>
      innerEnhancer((innerOnMsg) => input(innerOnMsg, onHalt))(onMsg)

  const socketProvider = enhanced(
    withSocket(
      () => {
        const [uri, protocols] =
          switchTo || actualEndpoints[idx++ % endpoints.length]
        switchTo = null
        onStatusChanged({
          type: WsEvent.CONNECTING,
          uri,
          protocols,
        })
        return [
          (latestSocket = new WebsocketClass(uri, protocols)),
          () => {
            onStatusChanged({
              type: WsEvent.CONNECTED,
              uri,
              protocols,
            })
          },
        ]
      },
      heartbeatTimeout,
      timeout,
    ),
  )

  const provider: AsyncJsonRpcProvider = midleware((onMsg, onHalt) =>
    socketProvider(onMsg, (e) => {
      onStatusChanged({
        type: WsEvent.ERROR,
        event: e,
      })
      onHalt(e)
    }),
  )

  let isFirst = true
  const result = getSyncProvider((onReady) => {
    if (isFirst) {
      isFirst = false
      onReady(provider)
      return noop
    }

    const token = setTimeout(onReady, 300, provider)
    return () => {
      clearTimeout(token)
    }
  })

  const switchFn: WsJsonRpcProvider["switch"] = (...args) => {
    if (status.type === WsEvent.CLOSE) return
    if (args.length) switchTo = args as any
    if (status.type !== WsEvent.ERROR && latestSocket) latestSocket.close()
  }

  return Object.assign(result, { switch: switchFn, getStatus: () => status })
}
