import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getProxy } from "./get-proxy"
import { AsyncJsonRpcProvider } from "./public-types"
import { ConnectableJsonRpcConnection } from "./internal-types"

const WAIT_BASE = 250
export const getSyncProvider =
  (input: () => Promise<AsyncJsonRpcProvider>): JsonRpcProvider =>
  (onMessage) => {
    let proxy: ConnectableJsonRpcConnection | null = getProxy(onMessage)
    let lastHalt = Date.now()
    let consecutiveHalts = 0
    let token: any
    const getWaitTime = () =>
      consecutiveHalts && 2 ** Math.min(5, consecutiveHalts) * WAIT_BASE

    const startNow = () =>
      input().then((cb) => {
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
              const diff = lastHalt - Date.now()
              consecutiveHalts +=
                diff > WAIT_BASE + getWaitTime() ? -consecutiveHalts : 1
              lastHalt += diff
              onHalt()
              start()
            }),
          )
      }, start)

    const start = () => {
      token = setTimeout(startNow, getWaitTime())
    }

    startNow()
    return {
      send: (msg) => {
        proxy?.send(msg)
      },
      disconnect: () => {
        clearTimeout(token)
        proxy?.disconnect()
        proxy = null
      },
    }
  }
