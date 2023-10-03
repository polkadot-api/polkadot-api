import { createClient } from "@polkadot-api/substrate-client"
import type { Chain } from "smoldot"
import type { BackgroundHelper } from "./types"
import { smoldotProvider } from "./smoldot-provider"
import { smoldotClient } from "./smoldot-client"
import type { ToExtension, ToPage } from "@/protocol"
import { CONTEXT, PORT } from "@/shared"

export * from "./types"

console.log(
  "@polkadot-api/light-client-extension-helpers background helper registered",
)

const addChainByUserCallbacks: Parameters<BackgroundHelper>[0][] = []

export const backgroundHelper: BackgroundHelper = async (onAddChainByUser) => {
  addChainByUserCallbacks.push(onAddChainByUser)
}

// TODO: side-effects + register chains
const postMessage = (port: chrome.runtime.Port, message: ToPage) =>
  port.postMessage(message)

// FIXME: use to customize bootnodes and update chain database
const chains: Record<
  string,
  { genesisHash: string; name: string; chainSpec: string }
> = {}

// Chains by TabId
const activeChains: Record<string, Record<string, Chain>> = {}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT.CONTENT_SCRIPT) {
    let isPortDisconnected = false
    port.onDisconnect.addListener((port) => {
      isPortDisconnected = true
      const tabId = port.sender?.tab?.id
      if (!tabId) return
      if (!activeChains[tabId]) return
      for (const [genesisHash, chain] of Object.entries(activeChains[tabId])) {
        try {
          chain.remove()
        } catch (error) {
          console.error("error removing chain", error)
        }
        delete activeChains[tabId][genesisHash]
      }
      delete activeChains[tabId]
    })
    port.onMessage.addListener(async (msg: ToExtension, port) => {
      switch (msg.type) {
        case "addChain": {
          const tabId = port.sender?.tab?.id
          if (!tabId) return
          try {
            const { chainSpec } = msg
            const { genesisHash, name } = await getChainData(chainSpec)

            if (chains[genesisHash]) {
              return postMessage(port, {
                origin: CONTEXT.CONTENT_SCRIPT,
                id: msg.id,
                result: chains[genesisHash],
              })
            }

            await Promise.all(
              addChainByUserCallbacks.map((cb) =>
                cb(
                  {
                    genesisHash,
                    name,
                    chainSpec,
                  },
                  tabId,
                ),
              ),
            )

            // FIXME: init chain
            chains[genesisHash] = {
              genesisHash,
              name,
              chainSpec,
            }

            postMessage(port, {
              origin: CONTEXT.CONTENT_SCRIPT,
              id: msg.id,
              result: chains[genesisHash],
            })

            // FIXME: broadcast/notify all tabs
            postMessage(port, {
              origin: CONTEXT.CONTENT_SCRIPT,
              type: "onAddChains",
              chains,
            })
          } catch (error) {
            console.error("background addChain error", error)
            postMessage(port, {
              origin: CONTEXT.CONTENT_SCRIPT,
              id: msg.id,
              error:
                error instanceof Error
                  ? error.message
                  : "unknown addChain error",
            })
          }
          break
        }
        case "getChains": {
          postMessage(port, {
            origin: CONTEXT.CONTENT_SCRIPT,
            id: msg.id,
            result: chains,
          })
          break
        }
        case "rpc": {
          const tabId = port.sender?.tab?.id
          if (!tabId) return
          activeChains[tabId] ??= {}

          if (activeChains[tabId][msg.genesisHash])
            return activeChains[tabId][msg.genesisHash].sendJsonRpc(msg.msg)

          if (!chains[msg.genesisHash])
            // FIXME: notify Page
            throw new Error("Unknown chain")

          const smoldotChain = (activeChains[tabId][msg.genesisHash] =
            await smoldotClient.addChain({
              chainSpec: chains[msg.genesisHash].chainSpec,
              disableJsonRpc: false,
              // FIXME: handle potentialRelayChains
              //   potentialRelayChains: []
              // FIXME: handle databaseContent
              // databaseContent,
            }))

          ;(async () => {
            while (true) {
              let jsonRpcResponse: string | undefined
              try {
                jsonRpcResponse = await smoldotChain.nextJsonRpcResponse()
              } catch (_) {
                break
              }

              if (isPortDisconnected) break

              // `nextJsonRpcResponse` throws an exception if we pass `disableJsonRpc: true` in the
              // config. We pass `disableJsonRpc: true` if `jsonRpcCallback` is undefined. Therefore,
              // this code is never reachable if `jsonRpcCallback` is undefined.
              try {
                postMessage(port, {
                  origin:
                    "@polkadot-api/light-client-extension-helper-context-content-script",
                  type: "rpc",
                  genesisHash: msg.genesisHash,
                  msg: jsonRpcResponse,
                })
              } catch (error) {
                console.error(
                  "JSON-RPC callback has thrown an exception:",
                  error,
                )
              }
            }
          })()

          smoldotChain.sendJsonRpc(msg.msg)
          break
        }

        default: {
          console.warn("Unrecognized message", msg)
          break
        }
      }
    })
  }
})

const getChainData = async (chainSpec: string) => {
  const client = createClient(
    await smoldotProvider({ smoldotClient, chainSpec }),
  )
  try {
    const [genesisHash, name] = await Promise.all(
      ["chainSpec_v1_genesisHash", "chainSpec_v1_chainName"].map(
        (method) =>
          new Promise<string>((resolve, reject) => {
            try {
              const unsub = client._request<string, never>(method, [], {
                onSuccess(result: any) {
                  unsub()
                  resolve(result)
                },
                onError(error: any) {
                  unsub()
                  reject(error)
                },
              })
            } catch (error) {
              reject(error)
            }
          }),
      ),
    )
    return { genesisHash, name }
  } finally {
    client.destroy()
  }
}
