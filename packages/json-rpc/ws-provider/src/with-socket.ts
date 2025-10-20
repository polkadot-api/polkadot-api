import { getAsyncProvider } from "./get-async-provider"
import { SocketEvents, SocketLoggerFn, WsEvent } from "./types"
import { noop } from "@polkadot-api/utils"

export const withSocket = (
  getWebsocket: () => [WebSocket, () => void],
  heartbeatTimeout: number,
  connectionTimeout: number,
  logger?: SocketLoggerFn,
) => {
  const logType: (
    type:
      | SocketEvents.TIMEOUT
      | SocketEvents.STALE
      | SocketEvents.CONNECTED
      | SocketEvents.DISCONNECT
      | SocketEvents.CLOSE,
  ) => void = logger ? (type) => logger({ type }) : noop
  const logMsg: (
    type: SocketEvents.IN | SocketEvents.OUT,
    msg: string,
  ) => void = logger ? (type, msg) => logger({ type, msg }) : noop

  return getAsyncProvider((onReady) => {
    const [socket, onConnected] = getWebsocket()
    logger?.({ type: SocketEvents.CONNECTING, url: socket.url })

    let suicide: (e?: any) => void = () => {
      suicide = noop
      cleanup()
      onReady(null)
    }

    let isFirst = true
    let heartbeatToken: number
    const heartbeat = () => {
      clearTimeout(heartbeatToken)
      const [time, event] = isFirst
        ? ([connectionTimeout, SocketEvents.TIMEOUT] as const)
        : ([heartbeatTimeout, SocketEvents.STALE] as const)
      isFirst = false
      heartbeatToken = setTimeout(() => {
        logType(event)
        suicide({
          type: WsEvent.ERROR,
          event: { type: "timeout" },
        })
      }, time)
    }
    const stopTimeout = () => {
      clearTimeout(heartbeatToken)
    }

    heartbeat()

    let cleanup = () => {
      stopTimeout()
    }

    const onError = (event: any) => {
      logger?.({ type: SocketEvents.ERROR, error: event })
      suicide({
        type: WsEvent.ERROR,
        event,
      })
    }
    const onClose = (event: any) => {
      logType(SocketEvents.CLOSE)
      suicide({
        type: WsEvent.CLOSE,
        event,
      })
    }

    const disconnect = () => {
      logType(SocketEvents.DISCONNECT)
      cleanup()
      try {
        socket.addEventListener("error", noop, { once: true })
        socket.close()
      } catch {}
    }

    const onOpen = () => {
      logType(SocketEvents.CONNECTED)
      onConnected()
      heartbeat()
      socket.removeEventListener("open", onOpen)
      onReady((onMsg, onHalt) => {
        cleanup = () => {
          cleanup = noop
          stopTimeout()
          socket.removeEventListener("error", onError)
          socket.removeEventListener("ping", heartbeat)
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("close", onClose)
        }

        suicide = (e?: any) => {
          suicide = noop
          cleanup()
          onHalt(e)
        }

        const _onMessage = (e: MessageEvent) => {
          heartbeat()
          if (typeof e.data === "string") {
            logMsg(SocketEvents.IN, e.data)
            onMsg(JSON.parse(e.data))
          }
        }

        socket.addEventListener("ping", heartbeat)
        socket.addEventListener("message", _onMessage)
        socket.addEventListener("error", onError)
        socket.addEventListener("close", onClose)
        return {
          send(m) {
            const msg = JSON.stringify(m)
            logMsg(SocketEvents.OUT, msg)
            socket.send(msg)
          },
          disconnect,
        }
      })
    }

    cleanup = () => {
      cleanup = noop
      stopTimeout()
      socket.removeEventListener("error", onError)
      socket.removeEventListener("close", onClose)
      socket.removeEventListener("open", onOpen)
    }

    socket.addEventListener("open", onOpen)
    socket.addEventListener("error", onError)

    return disconnect
  })
}
