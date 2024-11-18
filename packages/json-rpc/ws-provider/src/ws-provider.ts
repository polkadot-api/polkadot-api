import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import {
  GetWsProviderInput,
  StatusChange,
  WsJsonRpcProvider,
  WsEvent,
  WsProviderConfig,
} from "./types"
import { followEnhancer } from "./follow-enhancer"

const timeoutError: StatusChange = {
  type: WsEvent.ERROR,
  event: { type: "timeout" },
}

const noop = () => {}

const mapEndpoints = (
  endpoints: WsProviderConfig["endpoints"],
): Array<[string, string | string[]] | [string]> =>
  endpoints.map((x) => (typeof x === "string" ? [x] : [x.uri, x.protocol]))

export const getInternalWsProvider = (
  WebsocketClass: typeof WebSocket,
): GetWsProviderInput => {
  return (...args): WsJsonRpcProvider => {
    let endpoints: Array<[string, string | string[]] | [string]> = []
    let onStatusChanged: (status: StatusChange) => void = noop
    let timeout = 3_500

    const [firstArg] = args
    if (
      args.length === 1 &&
      typeof firstArg === "object" &&
      !Array.isArray(firstArg)
    ) {
      endpoints = mapEndpoints(firstArg.endpoints)
      onStatusChanged = firstArg.onStatusChanged ?? noop
      timeout = firstArg.timeout ?? timeout
    } else {
      if (typeof args[1] === "function")
        onStatusChanged = args[1] as (status: StatusChange) => void
      if (Array.isArray(firstArg)) endpoints = mapEndpoints(firstArg)
      else {
        endpoints = [[firstArg as string]]
        if (args[1] && args[1] !== onStatusChanged)
          endpoints[0][1] = args[1] as any
        if (args[2]) onStatusChanged = args[2] as any
      }
    }

    let idx = 0
    let status: StatusChange
    let switchTo: [string] | [string, string | string[]] | null = null
    let disconnect: (withHalt?: boolean) => void = noop

    let outerCleanup: () => void = noop
    const result = followEnhancer(
      getSyncProvider(async () => {
        const [uri, protocols] = switchTo || endpoints[idx++ % endpoints.length]
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
            outerCleanup()
            disconnect = noop
            socket.removeEventListener("message", _onMessage)
            socket.removeEventListener("error", onError)
            socket.removeEventListener("close", onClose)
            forceSocketClose()
            if (withHalt) onClose({})
          }

          return {
            send: (msg) => {
              socket.send(msg)
            },
            disconnect,
          }
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
}
