import type { ToExtension, ToPage } from "@/protocol"
import type { BackgroundHelper } from "./types"
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

// FIXME: revisit, also track by tabId
const activeChains: Record<string, { genesisHash: string; name: string }> = {}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT.CONTENT_SCRIPT) {
    port.onMessage.addListener(async (msg: ToExtension, port) => {
      switch (msg.type) {
        case "addChain": {
          const tabId = port.sender?.tab?.id
          if (!tabId) return
          try {
            // FIXME: use msg.chainspec to query for genesisHash & name
            const genesisHash = "chain-genesisHash"
            const name = "chain-name"

            if (activeChains[genesisHash]) {
              return postMessage(port, {
                origin: CONTEXT.CONTENT_SCRIPT,
                id: msg.id,
                result: (activeChains[genesisHash] ??= {
                  genesisHash,
                  name,
                }),
              })
            }

            await Promise.all(
              addChainByUserCallbacks.map((cb) =>
                cb(
                  {
                    genesisHash,
                    name,
                    chainspec: msg.chainspec,
                  },
                  tabId,
                ),
              ),
            )

            // FIXME: init chain
            activeChains[genesisHash] = {
              genesisHash,
              name,
            }

            postMessage(port, {
              origin: CONTEXT.CONTENT_SCRIPT,
              id: msg.id,
              result: activeChains[genesisHash],
            })

            postMessage(port, {
              origin: CONTEXT.CONTENT_SCRIPT,
              type: "onAddChains",
              // FIXME: revisit, may need to send all activeChains
              payload: activeChains[genesisHash],
            })

            console.log("background addChain ok")
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
            result: activeChains,
          })
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
