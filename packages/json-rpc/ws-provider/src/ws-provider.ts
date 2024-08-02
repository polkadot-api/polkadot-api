import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export const getInternalWsProvider =
  (WebsocketClass: typeof WebSocket) =>
  (uri: string, protocols?: string | string[]): JsonRpcProvider =>
    getSyncProvider(async () => {
      const socket = new WebsocketClass(uri, protocols)

      await new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          resolve()
          socket.removeEventListener("error", onError)
        }
        socket.addEventListener("open", onOpen, { once: true })

        const onError = (e: Event) => {
          console.error(
            `Unable to connect to ${uri}${
              protocols ? ", protocols: " + protocols : ""
            }`,
          )
          reject(e)
          socket.removeEventListener("open", onOpen)
        }
        socket.addEventListener("error", onError, { once: true })
      })

      return (onMessage, onHalt) => {
        const _onMessage = (e: MessageEvent) => {
          if (typeof e.data === "string") onMessage(e.data)
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
