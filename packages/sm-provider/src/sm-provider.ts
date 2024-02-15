import type { AddChainOptions, Client } from "smoldot"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export const getSmProvider =
  (smoldot: Client) =>
  (chainSpecOrOptions: string | AddChainOptions): ConnectProvider =>
    getSyncProvider(async () => {
      const chain = await smoldot.addChain(
        typeof chainSpecOrOptions === "string"
          ? { chainSpec: chainSpecOrOptions }
          : chainSpecOrOptions,
      )

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
