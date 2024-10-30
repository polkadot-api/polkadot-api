import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { StatusChange, WsJsonRpcProvider, WsEvent } from "./types"

export interface GetWsProviderInput {
  (
    uri: string,
    protocols?: string | string[],
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
  (
    uri: string,
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
  (
    endpoints: Array<string | { uri: string; protocol: string[] }>,
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
}

const timeoutError: StatusChange = {
  type: WsEvent.ERROR,
  event: { type: "timeout" },
}

const noop = () => {}

export const getInternalWsProvider = (
  WebsocketClass: typeof WebSocket,
): GetWsProviderInput => {
  return (...args): WsJsonRpcProvider => {
    let endpoints: Array<[string, string | string[]] | [string]> = []
    let onStatusChanged: (status: StatusChange) => void = noop

    if (typeof args[1] === "function") onStatusChanged = args[1]
    if (Array.isArray(args[0]))
      endpoints = args[0].map((x) =>
        typeof x === "string" ? [x] : [x.uri, x.protocol],
      )
    else {
      endpoints = [[args[0]]]
      if (args[1] && args[1] !== onStatusChanged)
        endpoints[0][1] = args[1] as any
      if (args[2]) onStatusChanged = args[2] as any
    }
    let idx = 0
    let status: StatusChange
    let switchTo: [string] | [string, string | string[]] | null = null
    let disconnect: (withHalt?: boolean) => void = noop

    const result = getSyncProvider(async () => {
      const [uri, protocols] = switchTo || endpoints[idx++ % endpoints.length]
      switchTo = null
      const socket = new WebsocketClass(uri, protocols)
      onStatusChanged(
        (status = {
          type: WsEvent.CONNECTING,
          uri,
          protocols,
        }),
      )

      await new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          cleanup()
          resolve()
        }

        const onError = (e: Event | null) => {
          cleanup()
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

        const timeoutToken = setTimeout(() => {
          onStatusChanged((status = timeoutError))
          reject(timeoutError.event)
        }, 3_500)
        const cleanup = () => {
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

      return (onMessage, onHalt) => {
        const _onMessage = (e: MessageEvent) => {
          if (typeof e.data === "string") onMessage(e.data)
        }
        const innerHalt =
          (reason: WsEvent.CLOSE | WsEvent.ERROR) => (e: any) => {
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

        socket.addEventListener("message", _onMessage)
        socket.addEventListener("error", onError)
        socket.addEventListener("close", onClose)
        disconnect = (withHalt) => {
          disconnect = noop
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("error", onError)
          socket.removeEventListener("close", onClose)
          socket.close()
          if (withHalt) onClose({})
        }

        return {
          send: (msg) => {
            socket.send(msg)
          },
          disconnect,
        }
      }
    }) as WsJsonRpcProvider

    result.getStatus = () => status
    result.switch = (...args) => {
      if (status.type === WsEvent.CLOSE) return
      if (args.length) switchTo = args as any
      if (status.type !== WsEvent.ERROR) disconnect(true)
    }
    return result
  }
}
