import type { GetProvider } from "@polkadot-api/json-rpc-provider"
import type { Client } from "smoldot"

type SmoldotProviderOptions = {
  smoldotClient: Client
  chainSpec: string
  relayChainSpec?: string
  databaseContent?: string
}
export const smoldotProvider = async ({
  smoldotClient,
  chainSpec,
  relayChainSpec,
  databaseContent,
}: SmoldotProviderOptions): Promise<GetProvider> => {
  const chain = await smoldotClient.addChain({
    chainSpec,
    disableJsonRpc: false,
    potentialRelayChains: relayChainSpec
      ? [
          await smoldotClient.addChain({
            chainSpec: relayChainSpec,
            disableJsonRpc: true,
          }),
        ]
      : [],
    databaseContent,
  })
  return (onMessage, onStatus) => {
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
      },
      send(msg: string) {
        chain.sendJsonRpc(msg)
      },
    }
  }
}
