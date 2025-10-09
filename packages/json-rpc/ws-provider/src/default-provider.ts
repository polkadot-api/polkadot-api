import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { StatusChange, WsJsonRpcProvider, WsEvent } from "./types-common"
import { followEnhancer } from "./follow-enhancer"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { WebSocketClass } from "./types-new"

const timeoutError: StatusChange = {
  type: WsEvent.ERROR,
  event: { type: "timeout" },
}

export const noop = () => {}

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
  const { onStatusChanged, innerEnhancer, timeout, heartbeatTimeout } = {
    ...defaultConfig,
    ...config,
  }
  const actualEndpoints = mapEndpoints(
    Array.isArray(endpoints) ? endpoints : [endpoints],
  )
  const WebsocketClass = config?.websocketClass ?? globalThis.WebSocket
  if (!WebsocketClass) throw new Error("Missing WebSocket class")

  let idx = 0
  let status: StatusChange
  let switchTo: [string] | [string, string | string[]] | null = null
  let disconnect: (withHalt?: boolean) => void = noop

  let outerCleanup: () => void = noop
  const result = followEnhancer(
    getSyncProvider(async () => {
      const [uri, protocols] =
        switchTo || actualEndpoints[idx++ % endpoints.length]
      switchTo = null
      const socket = new WebsocketClass(uri, protocols)
      const forceSocketClose = () => {
        try {
          socket.addEventListener("error", noop, { once: true })
          socket.close()
        } catch {}
      }
      onStatusChanged(
        (status = {
          type: WsEvent.CONNECTING,
          uri,
          protocols,
        }),
      )

      await new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          initialCleanup()
          resolve()
        }

        const onError = (e: Event | null) => {
          initialCleanup()
          if (e == null) forceSocketClose()
          console.error(
            `Unable to connect to ${uri}${
              protocols ? ", protocols: " + protocols : ""
            }`,
          )
          onStatusChanged(
            (status = {
              type: e ? WsEvent.ERROR : WsEvent.CLOSE,
              event: e,
            }),
          )
          setTimeout(reject, e ? 300 : 0, e)
        }

        const timeoutToken =
          timeout !== Infinity
            ? setTimeout(() => {
                initialCleanup()
                forceSocketClose()
                onStatusChanged((status = timeoutError))
                reject(timeoutError.event)
              }, timeout)
            : undefined

        const initialCleanup = () => {
          clearTimeout(timeoutToken)
          socket.removeEventListener("error", onError)
          socket.removeEventListener("open", onOpen)
        }
        socket.addEventListener("open", onOpen)
        socket.addEventListener("error", onError)
        disconnect = () => {
          onError(null)
        }
      })

      onStatusChanged(
        (status = {
          type: WsEvent.CONNECTED,
          uri,
          protocols,
        }),
      )

      let _onInnerMessage: (msg: string) => void
      const inner = innerEnhancer((onInnerMessage) => {
        _onInnerMessage = onInnerMessage
        return {
          send: (m) => {
            socket.send(m)
          },
          disconnect: () => {
            disconnect()
          },
        }
      })

      return (onMessage, onHalt) => {
        let heartbeatToken: NodeJS.Timeout
        const heartbeat = () => {
          clearTimeout(heartbeatToken)

          heartbeatToken = setTimeout(() => {
            console.warn(`Terminate: heartbeat timeout`)
            disconnect(true)
          }, heartbeatTimeout)
        }
        heartbeat()

        const connection = inner(onMessage)
        const _onMessage = (e: MessageEvent) => {
          heartbeat()
          if (typeof e.data === "string") _onInnerMessage(e.data)
        }
        const innerHalt =
          (reason: WsEvent.CLOSE | WsEvent.ERROR) => (e: any) => {
            clearTimeout(heartbeatToken)
            console.warn(`WS halt (${reason})`)
            onStatusChanged(
              (status = {
                type: reason,
                event: e,
              }),
            )
            onHalt()
          }
        const onError = innerHalt(WsEvent.ERROR)
        const onClose = innerHalt(WsEvent.CLOSE)

        socket.addEventListener("ping", heartbeat)
        socket.addEventListener("message", _onMessage)
        socket.addEventListener("error", onError)
        socket.addEventListener("close", onClose)
        disconnect = (withHalt) => {
          clearTimeout(heartbeatToken)
          outerCleanup()
          disconnect = noop
          socket.removeEventListener("ping", heartbeat)
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("error", onError)
          socket.removeEventListener("close", onClose)
          forceSocketClose()
          if (withHalt) onClose({})
          connection.disconnect()
        }

        return connection
      }
    }),
    () => {
      switchFn()
    },
  )
  outerCleanup = result.cleanup
  delete (result as any).cleanup

  const switchFn: WsJsonRpcProvider["switch"] = (...args) => {
    if (status.type === WsEvent.CLOSE) return
    if (args.length) switchTo = args as any
    if (status.type !== WsEvent.ERROR) disconnect(true)
  }

  return Object.assign(result, { switch: switchFn, getStatus: () => status })
}
