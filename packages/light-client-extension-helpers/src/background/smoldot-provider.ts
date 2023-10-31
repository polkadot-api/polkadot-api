import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import type { Client } from "smoldot"

type SmoldotProviderOptions = {
  smoldotClient: Client
  chainSpec: string
  relayChainSpec?: string
  databaseContent?: string
  relayChainDatabaseContent?: string
}
// TODO: check if this needs to use getSyncProvider
export const smoldotProvider = async ({
  smoldotClient,
  chainSpec,
  relayChainSpec,
  databaseContent,
  relayChainDatabaseContent,
}: SmoldotProviderOptions): Promise<ConnectProvider> => {
  const chain = await smoldotClient.addChain({
    chainSpec,
    disableJsonRpc: false,
    potentialRelayChains: relayChainSpec
      ? [
          await smoldotClient.addChain({
            chainSpec: relayChainSpec,
            disableJsonRpc: true,
            databaseContent: relayChainDatabaseContent,
          }),
        ]
      : [],
    databaseContent,
  })
  return (onMessage) => {
    let initialized = false
    return {
      disconnect() {
        try {
          chain.remove()
        } catch (error) {
          console.error("error removing chain", error)
        }
      },
      send(msg: string) {
        if (!initialized) {
          initialized = true
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
                console.error(
                  "JSON-RPC callback has thrown an exception:",
                  error,
                )
              }
            }
          })()
        }
        chain.sendJsonRpc(msg)
      },
    }
  }
}
