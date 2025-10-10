import { getAsyncProvider } from "./middleware/utils/get-async-provider"
import { WsEvent } from "./types-common"
import { noop } from "@polkadot-api/utils"

export const withSocket = (
  getWebsocket: () => [WebSocket, () => void],
  heartbeatTimeout: number,
  connectionTimeout: number,
) =>
  getAsyncProvider((onReady) => {
    const [socket, onConnected] = getWebsocket()

    let suicide: (e?: any) => void = () => {
      suicide = noop
      cleanup()
      console.log("ON READY NULLLL")
      onReady(null)
    }

    let isFirst = true
    let heartbeatToken: NodeJS.Timeout
    const heartbeat = () => {
      clearTimeout(heartbeatToken)
      const time = isFirst ? connectionTimeout : heartbeatTimeout
      isFirst = false
      heartbeatToken = setTimeout(() => {
        console.warn(`Terminate: heartbeat timeout....` + socket.url)
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
      console.error(new Error("caca de la vaca"))

      suicide({
        type: WsEvent.ERROR,
        event,
      })
    }
    const onClose = (event: any) => {
      suicide({
        type: WsEvent.CLOSE,
        event,
      })
    }

    const disconnect = () => {
      cleanup()
      try {
        socket.addEventListener("error", noop, { once: true })
        socket.close()
      } catch {}
    }

    const onOpen = () => {
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
          if (typeof e.data === "string") onMsg(JSON.parse(e.data))
        }

        socket.addEventListener("ping", heartbeat)
        socket.addEventListener("message", _onMessage)
        socket.addEventListener("error", onError)
        socket.addEventListener("close", onClose)
        return {
          send(m) {
            socket.send(JSON.stringify(m))
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
