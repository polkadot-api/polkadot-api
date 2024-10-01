import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getProxy } from "./get-proxy"
import { AsyncJsonRpcProvider } from "./public-types"
import { ConnectableJsonRpcConnection } from "./internal-types"

export const getSyncProvider =
  (input: () => Promise<AsyncJsonRpcProvider>): JsonRpcProvider =>
  (onMessage) => {
    let proxy: ConnectableJsonRpcConnection | null = getProxy(onMessage)

    const start = () => {
      input().then(
        (cb) => {
          if (!proxy) {
            try {
              cb(
                () => {},
                () => {},
              ).disconnect()
            } catch (_) {}
          } else
            proxy.connect((onMsg, onHalt) =>
              cb(onMsg, () => {
                onHalt()
                start()
              }),
            )
        },
        () => {
          proxy && setTimeout(start, 0)
        },
      )
    }

    start()
    return {
      send: (msg) => {
        proxy?.send(msg)
      },
      disconnect: () => {
        proxy?.disconnect()
        proxy = null
      },
    }
  }
