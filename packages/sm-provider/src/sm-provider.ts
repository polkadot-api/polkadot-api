import type { AddChainOptions, Client } from "smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

const addChainOperations = new WeakMap<Client, Promise<unknown>>()

export const getSmProvider = (
  smoldot: Client,
  chainSpecOrOptions: string | AddChainOptions,
): JsonRpcProvider =>
  getSyncProvider(async () => {
    const pending = addChainOperations.get(smoldot)
    if (pending) await pending

    const addChainP = smoldot.addChain(
      typeof chainSpecOrOptions === "string"
        ? { chainSpec: chainSpecOrOptions }
        : chainSpecOrOptions,
    )
    addChainOperations.set(smoldot, addChainP)
    const chain = await addChainP
    addChainOperations.delete(smoldot)

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
