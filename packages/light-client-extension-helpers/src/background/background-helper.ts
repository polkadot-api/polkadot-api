import { createClient } from "@polkadot-api/substrate-client"
import type { Chain } from "smoldot"
import type { BackgroundHelper } from "./types"
import { smoldotProvider } from "./smoldot-provider"
import { smoldotClient } from "./smoldot-client"
import type { ToExtension, ToPage } from "@/protocol"
import { CONTEXT, PORT } from "@/shared"

export * from "./types"

const addChainByUserCallbacks: Parameters<BackgroundHelper>[0][] = []

export const backgroundHelper: BackgroundHelper = async (onAddChainByUser) => {
  addChainByUserCallbacks.push(onAddChainByUser)
}

const postMessage = (port: chrome.runtime.Port, message: ToPage) =>
  port.postMessage(message)

// FIXME: use to customize bootnodes and update chain database
const chains: Record<
  string,
  { genesisHash: string; name: string; chainSpec: string }
> = {}

// Chains by TabId
const activeChains: Record<number, Record<string, Chain>> = {}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT.CONTENT_SCRIPT) {
    let isPortDisconnected = false
    port.onDisconnect.addListener((port) => {
      isPortDisconnected = true
      const tabId = port.sender?.tab?.id
      if (!tabId) return
      if (!activeChains[tabId]) return
      for (const [chainId, chain] of Object.entries(activeChains[tabId])) {
        try {
          chain.remove()
        } catch (error) {
          console.error("error removing chain", error)
        }
        delete activeChains[tabId][chainId]
      }
      delete activeChains[tabId]
    })
    const pendingAddChains: Record<string, boolean> = {}
    port.onMessage.addListener(async (msg: ToExtension, port) => {
      const tabId = port.sender?.tab?.id
      if (!tabId) return
      switch (msg.type) {
        case "addChain": {
          const tabId = port.sender?.tab?.id
          if (!tabId) return
          try {
            const { chainSpec, relayChainGenesisHash } = msg
            if (relayChainGenesisHash && !chains[relayChainGenesisHash])
              throw new Error(
                `Unknown relayChainGenesisHash ${relayChainGenesisHash}`,
              )
            const { genesisHash, name } = await getChainData(
              chainSpec,
              relayChainGenesisHash
                ? chains[relayChainGenesisHash].chainSpec
                : undefined,
            )

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
        case "add-well-known-chain":
        case "add-chain": {
          const tabId = port.sender?.tab?.id!
          if (!tabId) return
          activeChains[tabId] ??= {}
          try {
            if (
              activeChains[tabId][msg.chainId] ||
              pendingAddChains[msg.chainId]
            )
              throw new Error("Requested chainId already in use")

            pendingAddChains[msg.chainId] = true

            const chainSpec =
              msg.type === "add-well-known-chain"
                ? Object.values(chains).find(
                    (chain) => (chain.name = msg.chainName),
                  )?.name
                : msg.chainSpec
            if (!chainSpec) throw new Error("Unknown well-known chain")

            const smoldotChain = await smoldotClient.addChain({
              chainSpec,
              disableJsonRpc: false,
              // FIXME: handle potentialRelayChains
              //   potentialRelayChains: []
              // FIXME: handle databaseContent
              // databaseContent,
            })
            ;(async () => {
              while (true) {
                let jsonRpcMessage: string | undefined
                try {
                  jsonRpcMessage = await smoldotChain.nextJsonRpcResponse()
                } catch (_) {
                  break
                }

                if (isPortDisconnected) break

                // `nextJsonRpcResponse` throws an exception if we pass `disableJsonRpc: true` in the
                // config. We pass `disableJsonRpc: true` if `jsonRpcCallback` is undefined. Therefore,
                // this code is never reachable if `jsonRpcCallback` is undefined.
                try {
                  postMessage(port, {
                    origin: "substrate-connect-extension",
                    type: "rpc",
                    chainId: msg.chainId,
                    jsonRpcMessage,
                  })
                } catch (error) {
                  console.error(
                    "JSON-RPC callback has thrown an exception:",
                    error,
                  )
                }
              }
            })()

            if (!pendingAddChains[msg.chainId]) {
              smoldotChain.remove()
              return
            }
            delete pendingAddChains[msg.chainId]

            activeChains[tabId][msg.chainId] = smoldotChain

            postMessage(port, {
              origin: "substrate-connect-extension",
              type: "chain-ready",
              chainId: msg.chainId,
            })
          } catch (error) {
            delete pendingAddChains[msg.chainId]
            postMessage(port, {
              origin: "substrate-connect-extension",
              type: "error",
              chainId: msg.chainId,
              errorMessage:
                error instanceof Error
                  ? error.toString()
                  : "Unknown error when adding chain",
            })
          }

          break
        }
        case "remove-chain": {
          const tabId = port.sender?.tab?.id!
          if (!tabId) return

          delete pendingAddChains[msg.chainId]

          removeChain(tabId, msg.chainId)

          break
        }
        case "rpc": {
          const tabId = port.sender?.tab?.id
          if (!tabId) return

          const chain = activeChains?.[tabId]?.[msg.chainId]
          if (!chain) return

          try {
            chain.sendJsonRpc(msg.jsonRpcMessage)
          } catch (error) {
            removeChain(tabId, msg.chainId)
            postMessage(port, {
              origin: "substrate-connect-extension",
              type: "error",
              chainId: msg.chainId,
              errorMessage:
                error instanceof Error
                  ? error.toString()
                  : "Unknown error when sending RPC message",
            })
          }

          break
        }

        default: {
          const unrecognizedMsg: never = msg
          console.warn("Unrecognized message", unrecognizedMsg)
          break
        }
      }
    })
  }
})

const removeChain = (tabId: number, chainId: string) => {
  const chain = activeChains?.[tabId]?.[chainId]
  delete activeChains?.[tabId]?.[chainId]
  try {
    chain?.remove()
  } catch (error) {
    console.error("error removing chain", error)
  }
}

const getChainData = async (chainSpec: string, relayChainSpec?: string) => {
  const client = createClient(
    await smoldotProvider({ smoldotClient, chainSpec, relayChainSpec }),
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
