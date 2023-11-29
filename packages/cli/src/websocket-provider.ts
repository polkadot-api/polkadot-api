import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { ErrorEvent, MessageEvent, WebSocket } from "ws"

export const WebSocketProvider = (
  uri: string,
  protocols?: string | string[],
): ConnectProvider =>
  getSyncProvider(async () => {
    const socket = new WebSocket(uri, protocols)

    await new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        resolve()
        socket.removeEventListener("error", onError)
      }
      socket.addEventListener("open", onOpen, { once: true })

      const onError = (e: ErrorEvent) => {
        reject(e)
        socket.removeEventListener("open", onOpen)
      }
      socket.addEventListener("error", onError, { once: true })
    })

    return (onMessage, onHalt) => {
      const _onMessage = (e: MessageEvent) => {
        if (typeof e.data === "string") {
          onMessage(e.data)
        } else {
          console.log("e.data not string", e.data)
        }
      }

      socket.addEventListener("message", _onMessage)
      socket.addEventListener("error", onHalt)
      socket.addEventListener("close", onHalt)

      return {
        send: (msg) => {
          socket.send(msg)
        },
        disconnect: () => {
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("error", onHalt)
          socket.removeEventListener("close", onHalt)
          socket.close()
        },
      }
    }
  })
