import type { GetProvider, Provider } from "@polkadot-api/json-rpc-provider"
import type { Client, Chain } from "smoldot"

type SmoldotProviderOptions = {
  smoldotClient: Client
  chainSpec: string
  databaseContent?: string
}
export const smoldotProvider = ({
  smoldotClient,
  chainSpec,
  databaseContent,
}: SmoldotProviderOptions): GetProvider => {
  return (onMessage, onStatus): Provider => {
    let chain: Chain | null = null
    let pending = false
    return {
      open() {
        if (chain || pending) return
        pending = true
        smoldotClient!
          .addChain({
            chainSpec,
            disableJsonRpc: false,
            // FIXME: handle potentialRelayChains
            //   potentialRelayChains: []
            databaseContent,
          })
          .then((smoldotChain) => {
            ;(async () => {
              while (true) {
                let jsonRpcResponse
                try {
                  jsonRpcResponse = await smoldotChain.nextJsonRpcResponse()
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
            chain = smoldotChain
            onStatus("connected")
          })
          .catch((e) => {
            console.warn("There was a problem adding the Chain")
            console.error(e)
            onStatus("disconnected")
          })
          .finally(() => {
            pending = false
          })
      },
      close() {
        chain?.remove()
        chain = null
      },
      send(msg: string) {
        chain!.sendJsonRpc(msg)
      },
    }
  }
}
