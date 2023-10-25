import { SubstrateClient, createClient } from "@polkadot-api/substrate-client"
import {
  Tuple,
  compact,
  metadata as metadataCodec,
} from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder } from "@polkadot-api/substrate-codegen"
import type { AddChainOptions, Chain } from "smoldot"
import type { BackgroundHelper } from "./types"
import { smoldotProvider } from "./smoldot-provider"
import { smoldotClient } from "./smoldot-client"
import type {
  BackgroundRequest,
  BackgroundResponse,
  BackgroundResponseError,
  ToExtension,
  ToPage,
} from "@/protocol"
import { ALARM, CONTEXT, PORT, storage } from "@/shared"

export * from "./types"

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM.DATABASE_UPDATE) return
  const chains = await storage.getChains()
  Object.values(chains).forEach(
    async ({ genesisHash, chainSpec, relayChainGenesisHash }) => {
      const client = createClient(
        await smoldotProvider({
          smoldotClient,
          chainSpec,
          relayChainSpec: relayChainGenesisHash
            ? chains[relayChainGenesisHash]?.chainSpec
            : undefined,
          databaseContent: await storage.get({
            type: "databaseContent",
            genesisHash,
          }),
        }),
      )
      const chainHeadFollower = client.chainHead(
        true,
        async (event) => {
          if (event.type === "newBlock") {
            chainHeadFollower.unpin([event.blockHash])
            return
          } else if (event.type !== "initialized") return
          try {
            await storage.set(
              { type: "databaseContent", genesisHash },
              await substrateClientRequest(
                client,
                "chainHead_unstable_finalizedDatabase",
              ),
            )
          } catch (error) {
            console.error("Error updating DB", error)
          }
          chainHeadFollower.unfollow()
          client.destroy()
        },
        (error) => {
          console.error("Error updating DB", error)
          chainHeadFollower.unfollow()
          client.destroy()
        },
      )
    },
  )
})

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (
    reason !== chrome.runtime.OnInstalledReason.INSTALL &&
    reason !== chrome.runtime.OnInstalledReason.UPDATE
  )
    return

  chrome.alarms.create(ALARM.DATABASE_UPDATE, {
    periodInMinutes: 2,
  })
})

const addChainByUserCallbacks: Parameters<BackgroundHelper>[0][] = []

export const backgroundHelper: BackgroundHelper = async (onAddChainByUser) => {
  addChainByUserCallbacks.push(onAddChainByUser)
}

storage.onChainsChanged(async (chains) => {
  ;(await chrome.tabs.query({ url: ["https://*/*", "http://*/*"] })).forEach(
    ({ id }) =>
      chrome.tabs.sendMessage(id!, {
        origin: CONTEXT.CONTENT_SCRIPT,
        type: "onAddChains",
        chains,
      } as ToPage),
  )
})

const postMessage = (port: chrome.runtime.Port, message: ToPage) =>
  port.postMessage(message)

// Chains by TabId
const activeChains: Record<
  number,
  Record<string, { chain: Chain; genesisHash: string }>
> = {}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT.CONTENT_SCRIPT || port.name === PORT.EXTENSION_PAGE) {
    let isPortDisconnected = false
    port.onDisconnect.addListener((port) => {
      isPortDisconnected = true
      const tabId = port.sender?.tab?.id
      if (!tabId) return
      if (!activeChains[tabId]) return
      for (const [chainId, { chain }] of Object.entries(activeChains[tabId])) {
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
    port.onMessage.addListener(
      async (
        // FIXME: use @substrate/connect types
        msg: ToExtension & { origin: "substrate-connect-client" },
        port,
      ) => {
        const tabId = port.sender?.tab?.id
        if (!tabId) return
        switch (msg.type) {
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
              const chains = await storage.getChains()

              let addChainOptions: AddChainOptions
              if (msg.type === "add-well-known-chain") {
                const chain =
                  Object.values(chains).find(
                    (chain) => chain.genesisHash === msg.chainName,
                  ) ??
                  Object.values(chains).find(
                    (chain) => chain.name === msg.chainName,
                  )
                if (!chain) throw new Error("Unknown well-known chain")
                addChainOptions = {
                  // FIXME: use custom bootNodes
                  chainSpec: chain.chainSpec,
                  disableJsonRpc: false,
                  potentialRelayChains: chain.relayChainGenesisHash
                    ? [
                        await smoldotClient.addChain({
                          chainSpec:
                            // FIXME: use custom bootNodes
                            chains[chain.relayChainGenesisHash].chainSpec,
                          disableJsonRpc: true,
                          databaseContent: await storage.get({
                            type: "databaseContent",
                            genesisHash: chain.relayChainGenesisHash,
                          }),
                        }),
                      ]
                    : [],
                  databaseContent: await storage.get({
                    type: "databaseContent",
                    genesisHash: chain.genesisHash,
                  }),
                }
              } else {
                const relayChainGenesisHashOrChainId =
                  msg.potentialRelayChainIds[0]
                addChainOptions = {
                  chainSpec: msg.chainSpec,
                  disableJsonRpc: false,
                  potentialRelayChains: chains[relayChainGenesisHashOrChainId]
                    ? [
                        await smoldotClient.addChain({
                          chainSpec:
                            // FIXME: use custom bootNodes
                            chains[relayChainGenesisHashOrChainId].chainSpec,
                          disableJsonRpc: true,
                          databaseContent: await storage.get({
                            type: "databaseContent",
                            genesisHash: relayChainGenesisHashOrChainId,
                          }),
                        }),
                      ]
                    : msg.potentialRelayChainIds
                        .filter((chainId) => activeChains[tabId][chainId])
                        .map((chainId) => activeChains[tabId][chainId].chain),
                }
              }

              const smoldotChain = await smoldotClient.addChain(addChainOptions)
              const genesisHash = await getGenesisHash(smoldotChain)

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

              activeChains[tabId][msg.chainId] = {
                chain: smoldotChain,
                genesisHash,
              }

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

            const chain = activeChains?.[tabId]?.[msg.chainId]?.chain
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
      },
    )
  }
})

chrome.runtime.onMessage.addListener(
  (msg: BackgroundRequest, sender, sendResponse) => {
    // FIXME: check msg.origin to any BackgroundRequest
    switch (msg.type) {
      case "getChain": {
        ;(async () => {
          const tabId = sender?.tab?.id
          if (!tabId) return
          try {
            const chains = await storage.getChains()
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
              return sendBackgroundResponse(sendResponse, {
                type: "getChainResponse",
                chain: chains[genesisHash],
              })
            }

            const chain = {
              genesisHash,
              name,
              chainSpec,
              relayChainGenesisHash,
            }

            await Promise.all(
              addChainByUserCallbacks.map((cb) => cb(chain, tabId)),
            )

            sendBackgroundResponse(sendResponse, {
              type: "getChainResponse",
              chain,
            })
          } catch (error) {
            console.error("background addChain error", error)
            sendBackgroundErrorResponse(sendResponse, error)
          }
        })()
        return true
      }
      case "getChains": {
        storage.getChains().then((chains) => {
          sendBackgroundResponse(sendResponse, {
            type: "getChainsResponse",
            chains,
          })
        })
        return true
      }
      case "getChainData": {
        getChainData(msg.chainSpec, msg.relayChainGenesisHash)
          .then((chainData) =>
            sendBackgroundResponse(sendResponse, {
              type: "getChainDataResponse",
              ...chainData,
            }),
          )
          .catch((error) => sendBackgroundErrorResponse(sendResponse, error))
        return true
      }
      case "getActiveConnections": {
        sendBackgroundResponse(sendResponse, {
          type: "getActiveConnectionsResponse",
          connections: Object.entries(activeChains).reduce(
            (acc, [tabIdStr, tabChains]) => {
              const tabId = parseInt(tabIdStr)
              Object.values(tabChains).forEach(({ genesisHash }) =>
                // TODO: Should options-tab/popup connections be filtered from activeConnectionså?
                acc.push({ tabId, genesisHash }),
              )
              return acc
            },
            [] as { tabId: number; genesisHash: string }[],
          ),
        })
        break
      }
      case "disconnect": {
        Object.entries(activeChains[msg.tabId] ?? {})
          // TODO: Should options-tab/popup connections connections be disconnectable?
          .filter(([_, { genesisHash }]) => genesisHash === msg.genesisHash)
          .forEach(
            // FIXME: notify content-script
            ([chainId]) => removeChain(msg.tabId, chainId),
          )
        // TODO: this might not be needed
        sendBackgroundResponse(sendResponse, {
          type: "disconnectResponse",
        })
        break
      }
      default: {
        const unrecognizedMsg: never = msg
        console.warn("Unrecognized message", unrecognizedMsg)
        break
      }
    }
    return
  },
)

const removeChain = (tabId: number, chainId: string) => {
  const chain = activeChains?.[tabId]?.[chainId]?.chain
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
      ["chainSpec_v1_genesisHash", "chainSpec_v1_chainName"].map((method) =>
        substrateClientRequest<string>(client, method),
      ),
    )
    const ss58Format: number = await new Promise(async (resolve, reject) => {
      const chainHeadFollower = client.chainHead(
        true,
        async (event) => {
          try {
            if (event.type === "newBlock") {
              chainHeadFollower.unpin([event.blockHash])
              return
            }
            if (event.type !== "initialized") return
            const [, { metadata }] = Tuple(compact, metadataCodec).dec(
              await chainHeadFollower.call(
                event.finalizedBlockHash,
                "Metadata_metadata",
                "",
              ),
            )
            if (metadata.tag !== "v14")
              throw new Error("Wrong metadata version")
            const prefix = metadata.value.pallets
              .find((x) => x.name === "System")
              ?.constants.find((x) => x.name === "SS58Prefix")
            chainHeadFollower.unfollow()
            if (!prefix) throw new Error("unable to get SS58Prefix")
            resolve(
              getDynamicBuilder(metadata.value)
                .buildConstant("System", "SS58Prefix")
                .dec(prefix.value),
            )
          } catch (error) {
            reject(error)
          }
        },
        reject,
      )
    })
    return {
      genesisHash,
      name,
      ss58Format,
    }
  } finally {
    client.destroy()
  }
}

// FIXME: merge with getChainData
const getGenesisHash = async (smoldotChain: Chain): Promise<string> => {
  smoldotChain.sendJsonRpc(
    JSON.stringify({
      jsonrpc: "2.0",
      id: "chainSpec_v1_genesisHash",
      method: "chainSpec_v1_genesisHash",
      params: [],
    }),
  )
  return JSON.parse(await smoldotChain.nextJsonRpcResponse()).result
}

const sendBackgroundResponse = <
  T extends BackgroundResponse | BackgroundResponseError,
>(
  sendResponse: (msg: any) => void,
  msg: T,
) => sendResponse(msg)

const sendBackgroundErrorResponse = (
  sendResponse: (msg: any) => void,
  error: Error | string | unknown,
) =>
  sendBackgroundResponse(sendResponse, {
    type: "error",
    error:
      error instanceof Error
        ? error.toString()
        : typeof error === "string"
        ? error
        : "Unknown error getting chain data",
  })

const substrateClientRequest = <T>(
  client: SubstrateClient,
  method: string,
  params: any[] = [],
) =>
  new Promise<T>((resolve, reject) => {
    try {
      const unsub = client._request(method, params, {
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
  })
