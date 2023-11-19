import WebSocket from "ws"
import {
  ScProvider,
  WellKnownChain,
  ConnectProvider,
} from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"
import {
  compact,
  metadata,
  CodecType,
  Tuple,
} from "@polkadot-api/substrate-bindings"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

const smProvider = ScProvider(
  WellKnownChain.polkadot /*, {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
)

const withLogsProvider = (input: ConnectProvider): ConnectProvider => {
  return (onMsg) => {
    const result = input((msg) => {
      console.log("<< " + msg)
      onMsg(msg)
    })

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

export const WebSocketProvider = (uri: string, protocols?: string | string[]) =>
  getSyncProvider(async () => {
    const socket = new WebSocket(uri, protocols)

    await new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        resolve()
        socket.removeEventListener("error", onError)
      }
      socket.addEventListener("open", onOpen, { once: true })

      const onError = (e: WebSocket.ErrorEvent) => {
        reject(e)
        socket.removeEventListener("open", onOpen)
      }
      socket.addEventListener("error", onError, { once: true })
    })

    return (onMessage, onHalt) => {
      const _onMessage = (e: WebSocket.MessageEvent) => {
        onMessage(e.data as string)
      }

      socket.addEventListener("message", _onMessage)
      socket.addEventListener("error", onHalt)
      socket.addEventListener("close", onHalt)

      return {
        send(msg) {
          socket.send(msg)
        },
        disconnect() {
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("error", onHalt)
          socket.removeEventListener("close", onHalt)
          socket.close()
        },
      }
    }
  })

export const { chainHead } = createClient(
  withLogsProvider(WebSocketProvider("wss://rpc.polkadot.io")),
)

type Metadata = CodecType<typeof metadata>

const opaqueMeta = Tuple(compact, metadata)

export const getMetadata = (): Promise<Metadata> =>
  new Promise<Metadata>((res, rej) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (message) => {
        if (message.type === "newBlock") {
          chainHeadFollower.unpin([message.blockHash])
          return
        }
        if (requested || message.type !== "initialized") return
        const latestFinalized = message.finalizedBlockHash
        if (requested) return
        requested = true

        chainHeadFollower
          .call(latestFinalized, "Metadata_metadata", "")
          .then((response) => {
            const [, metadata] = opaqueMeta.dec(response)
            res(metadata)
          })
          .catch((e) => {
            console.log("error", e)
            rej(e)
          })
          .finally(() => {
            chainHeadFollower.unfollow()
          })
      },
      () => {},
    )
  })
