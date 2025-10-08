import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getProxy } from "./get-proxy"
import { AsyncJsonRpcProvider } from "./public-types"
import { ConnectableJsonRpcConnection } from "./internal-types"

const noop = () => {}

export const getSyncProvider =
  (
    input: (onResult: (x: AsyncJsonRpcProvider | null) => void) => () => void,
  ): JsonRpcProvider =>
  (onMessage) => {
    let proxy: ConnectableJsonRpcConnection | null = getProxy(onMessage)

    let stop = noop
    let start = () => {
      const token = setTimeout(() => {
        stop = input((cb) => {
          stop = noop
          if (!cb) start()
          else if (proxy)
            proxy.connect((onMsg, onHalt) =>
              cb(onMsg, (e) => {
                onHalt(e)
                start()
              }),
            )
        })
      }, 0)
      stop = () => clearTimeout(token)
    }
    start()

    return {
      send(msg) {
        proxy?.send(msg)
      },
      disconnect() {
        stop()
        stop = noop
        proxy?.disconnect()
        proxy = null
      },
    }
  }
