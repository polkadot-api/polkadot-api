import type { GetProvider } from "@polkadot-api/json-rpc-provider"
import type { Chain, Client } from "smoldot"

const getProviderChains = new WeakMap<GetProvider, Chain>()

type SmoldotProviderOptions = {
  smoldotClient: Client
  chainSpec: string
  databaseContent?: string
}
export const smoldotProvider = async ({
  smoldotClient,
  chainSpec,
  databaseContent,
}: SmoldotProviderOptions): Promise<GetProvider> => {
  const chain = await smoldotClient!.addChain({
    chainSpec,
    disableJsonRpc: false,
    // FIXME: handle potentialRelayChains
    //   potentialRelayChains: []
    databaseContent,
  })
  const getProvider: GetProvider = (onMessage, onStatus) => {
    let opened = false
    return {
      open() {
        if (opened) return
        opened = true
        ;(async () => {
          while (true) {
            let jsonRpcResponse
            try {
              jsonRpcResponse = await chain.nextJsonRpcResponse()
            } catch (_) {
              break
            }

            // `nextJsonRpcResponse` throws an exception if we pass `disableJsonRpc: true` in the
            // config. We pass `disableJsonRpc: true` if `jsonRpcCallback` is undefined. Therefore,
            // this code is never reachable if `jsonRpcCallback` is undefined.
            try {
              onMessage(jsonRpcResponse)
            } catch (error) {
              console.error("JSON-RPC callback has thrown an exception:", error)
            }
          }
        })()
        onStatus("connected")
      },
      close() {
        try {
          chain.remove()
        } catch (error) {
          console.error("error removing chain", error)
        }
        getProviderChains.delete(getProvider)
        // TODO: validate, Should onStatus be invoked on .close()?
        onStatus("disconnected")
      },
      send(msg: string) {
        chain.sendJsonRpc(msg)
      },
    }
  }
  getProviderChains.set(getProvider, chain)
  return getProvider
}
