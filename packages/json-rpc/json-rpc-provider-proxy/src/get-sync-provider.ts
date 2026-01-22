import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getProxy } from "./get-proxy"
import { InnerJsonRpcProvider } from "./public-types"
import { ConnectableJsonRpcConnection } from "./internal-types"

const noop = () => {}
const WAIT_BASE = 250

export const getSyncProvider =
  (
    input: (onResult: (x: InnerJsonRpcProvider | null) => void) => () => void,
  ): JsonRpcProvider =>
  (onMessage) => {
    let proxy: ConnectableJsonRpcConnection | null = getProxy(onMessage)
    let lastHalt = Date.now()
    let consecutiveHalts = 0
    let token: any
    const getWaitTime = () =>
      consecutiveHalts && 2 ** Math.min(5, consecutiveHalts) * WAIT_BASE

    let stop = noop
    let startNow = () => {
      const token = setTimeout(() => {
        let isWaiting = true
        const result = input((cb) => {
          isWaiting = false
          stop = noop
          if (!cb) start()
          else if (proxy)
            proxy.connect((onMsg, onHalt) => {
              let isOn = true
              return cb(onMsg, (e) => {
                if (isOn) {
                  isOn = false
                  const diff = Date.now() - lastHalt
                  consecutiveHalts +=
                    diff > WAIT_BASE + getWaitTime() ? -consecutiveHalts : 1
                  lastHalt += diff
                  onHalt(e)
                  start()
                }
              })
            })
        })
        if (isWaiting) stop = result
      }, 0)
      stop = () => clearTimeout(token)
    }

    const start = () => {
      token = setTimeout(startNow, getWaitTime())
    }
    startNow()

    return {
      send(msg) {
        proxy?.send(msg)
      },
      disconnect() {
        clearTimeout(token)
        stop()
        stop = noop
        proxy?.disconnect()
        proxy = null
      },
    }
  }
