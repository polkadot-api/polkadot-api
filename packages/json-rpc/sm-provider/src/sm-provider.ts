import type { Chain } from "smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

let pending: Promise<Chain> | null

export const getSmProvider = (chain: Chain | Promise<Chain>): JsonRpcProvider =>
  getSyncProvider(async () => {
    while (pending) await pending

    let resolvedChain: Chain
    if (chain instanceof Promise) {
      pending = chain
      resolvedChain = await chain
      pending = null
    } else resolvedChain = chain

    return (listener, onError) => {
      let listening = true
      ;(async () => {
        try {
          for await (const message of resolvedChain.jsonRpcResponses) {
            if (!listening) break
            listener(message)
          }
        } catch {
          if (listening) onError()
        }
      })()

      return {
        send(msg: string) {
          resolvedChain.sendJsonRpc(msg)
        },
        disconnect() {
          listening = false
          resolvedChain.remove()
        },
      }
    }
  })
