import { JsonRpcDisabledError, type Chain } from "@polkadot-api/smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  getSyncProvider,
  InnerJsonRpcProvider,
} from "@polkadot-api/json-rpc-provider-proxy"

let pending: Promise<any> | null

const chains = new WeakSet<Chain>()

export const getSmProvider = (
  getChain: () => Chain | Promise<Chain>,
): JsonRpcProvider =>
  getSyncProvider((onReady) => {
    let isRunning = true
    let resolvedChain: Chain
    const provider: InnerJsonRpcProvider = (onMsg, onHalt) => {
      let listening = isRunning
      ;(async () => {
        do {
          let message = ""
          try {
            message = await resolvedChain.nextJsonRpcResponse()
          } catch (e) {
            if (listening) {
              if (e instanceof JsonRpcDisabledError) console.error(e)
              else onHalt(e)
            }
            return
          }
          if (!listening) break
          onMsg(JSON.parse(message))
        } while (listening)
      })()

      return {
        send(msg) {
          resolvedChain.sendJsonRpc(JSON.stringify(msg))
        },
        disconnect() {
          listening = false
          resolvedChain.remove()
        },
      }
    }

    ;(async () => {
      while (isRunning && pending) await pending

      try {
        const chain = getChain()
        if (chain instanceof Promise) {
          pending = chain.catch(() => {})
          resolvedChain = await chain
          pending = null
        } else resolvedChain = chain

        if (chains.has(resolvedChain)) {
          console.warn(
            "Can't re-use Chain: Make sure to return a new Chain on the getSmProvider factory",
          )
          return
        }
        chains.add(resolvedChain)

        if (isRunning) onReady(provider)
        else resolvedChain.remove()
      } catch {
        if (isRunning) onReady(null)
      }
    })()

    return () => {
      isRunning = false
    }
  })
