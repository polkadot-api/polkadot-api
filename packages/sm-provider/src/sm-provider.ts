import type { AddChainOptions, Client } from "smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export const getSmProvider = (smoldot: Client) => {
  let pending: Promise<any> | null = null
  return (chainSpecOrOptions: string | AddChainOptions): JsonRpcProvider =>
    getSyncProvider(async () => {
      if (pending) await pending

      const addChainP = smoldot.addChain(
        typeof chainSpecOrOptions === "string"
          ? { chainSpec: chainSpecOrOptions }
          : chainSpecOrOptions,
      )
      pending = addChainP
      const chain = await addChainP
      pending = null

      return (listener, onError) => {
        let listening = true
        ;(async () => {
          do {
            let message = ""
            try {
              message = await chain.nextJsonRpcResponse()
            } catch (e) {
              if (listening) onError()
              return
            }
            if (!listening) break
            listener(message)
          } while (listening)
        })()

        return {
          send(msg: string) {
            chain.sendJsonRpc(msg)
          },
          disconnect() {
            listening = false
            chain.remove()
          },
        }
      }
    })
}
