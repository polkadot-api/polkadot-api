import type {
  ToExtension,
  ToExtensionRequest,
  ToPage,
  ToPageResponse,
} from "@/protocol"
import { CONTEXT, getRandomChainId } from "@/shared"
import type { LightClientProvider, RawChain } from "./types"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

export * from "./types"

const postToExtension = (msg: ToExtension) =>
  window.postMessage(msg, window.origin)

const validOrigins = [CONTEXT.CONTENT_SCRIPT, "substrate-connect-extension"]

const checkMessage = (msg: any): msg is ToPage => {
  if (!msg) return false
  if (!validOrigins.includes(msg?.origin)) return false
  if (!msg?.type && !msg?.id) return false
  return true
}

window.addEventListener("message", ({ data, source }) => {
  if (source !== window) return
  if (!validOrigins.includes(data?.origin)) return
  if (!checkMessage(data)) return console.warn("Unrecognized message", data)
  if (data.origin === "substrate-connect-extension")
    return rawChainCallbacks[data.chainId]?.(data)
  if (data.id !== undefined) return handleResponse(data)
  if (data.type === "onAddChains")
    return chainsChangeCallbacks.forEach((cb) =>
      cb(
        Object.fromEntries(
          Object.entries(data.chains).map(([key, { genesisHash, name }]) => [
            key,
            createRawChain({ genesisHash, name }),
          ]),
        ),
      ),
    )

  console.warn("Unhandled message", data)
})

const chainsChangeCallbacks: Parameters<
  LightClientProvider["addChainsChangeListener"]
>[0][] = []

const pendingRequests: Record<
  string,
  { resolve(result: any): void; reject(error: any): void }
> = {}

const requestReply = <T>(msg: ToExtensionRequest): Promise<T> => {
  const promise = new Promise<T>((resolve, reject) => {
    pendingRequests[msg.id] = { resolve, reject }
  })
  postToExtension(msg)
  return promise
}
const handleResponse = (msg: ToPageResponse) => {
  const pendingRequest = pendingRequests[msg.id]
  if (!pendingRequest) return console.warn("Unhandled response", msg)
  msg.error
    ? pendingRequest.reject(msg.error)
    : pendingRequest.resolve(msg.result)
  delete pendingRequests[msg.id]
}

// FIXME: improve id generation, random-id?
const nextId = (
  (initialId) => () =>
    "" + initialId++
)(0)
export const getLightClientProvider =
  async (): Promise<LightClientProvider> => {
    let chains = await requestReply<
      Record<
        string,
        {
          name: string
          genesisHash: string
        }
      >
    >({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      request: {
        type: "getChains",
      },
    })
    chainsChangeCallbacks.push((chains_) => (chains = chains_))
    return {
      async getChain(chainSpec, relayChainGenesisHash) {
        const chainInfo = await requestReply<{
          name: string
          genesisHash: string
        }>({
          origin: CONTEXT.WEB_PAGE,
          id: nextId(),
          request: {
            type: "addChain",
            chainSpec,
            relayChainGenesisHash,
          },
        })
        return createRawChain(
          chains[chainInfo.genesisHash]
            ? chainInfo
            : { ...chainInfo, chainSpec, relayChainGenesisHash },
        )
      },
      getChains() {
        return Object.entries(chains).reduce(
          (acc, [key, chain]) => {
            acc[key] = createRawChain(chain)
            return acc
          },
          {} as Record<string, RawChain>,
        )
      },
      addChainsChangeListener(callback) {
        chainsChangeCallbacks.push(callback)
        return () => {
          removeArrayItem(chainsChangeCallbacks, callback)
        }
      },
    }
  }

const rawChainCallbacks: Record<
  string,
  (msg: ToPage & { origin: "substrate-connect-extension" }) => void
> = {}

const createRawChain = ({
  name,
  genesisHash,
  chainSpec,
  relayChainGenesisHash,
}: {
  name: string
  genesisHash: string
  chainSpec?: string
  relayChainGenesisHash?: string
}): RawChain => {
  return {
    name,
    genesisHash,
    connect: getSyncProvider(async () => {
      const chainId = getRandomChainId()
      await new Promise<void>((resolve, reject) => {
        rawChainCallbacks[chainId] = (msg) => {
          switch (msg.type) {
            case "chain-ready": {
              resolve()
              break
            }
            case "error": {
              reject(new Error(msg.errorMessage))
              break
            }
            default:
              reject(new Error(`Unrecognized message ${JSON.stringify(msg)}`))
              break
          }
          delete rawChainCallbacks[chainId]
        }
        postToExtension(
          chainSpec
            ? {
                origin: "substrate-connect-client",
                type: "add-chain",
                chainId,
                chainSpec,
                potentialRelayChainIds: relayChainGenesisHash
                  ? [relayChainGenesisHash]
                  : [],
              }
            : {
                origin: "substrate-connect-client",
                type: "add-well-known-chain",
                chainId,
                chainName: genesisHash,
              },
        )
      })
      return (onMessage, onHalt) => {
        rawChainCallbacks[chainId] = (msg) => {
          switch (msg.type) {
            case "rpc": {
              onMessage(msg.jsonRpcMessage)
              break
            }
            case "error": {
              console.error(msg.errorMessage)
              delete rawChainCallbacks[chainId]
              onHalt()
              break
            }
            default:
              console.warn(`Unrecognized message ${JSON.stringify(msg)}`)
              break
          }
        }
        return {
          send(jsonRpcMessage) {
            postToExtension({
              origin: "substrate-connect-client",
              type: "rpc",
              chainId,
              jsonRpcMessage,
            })
          },
          disconnect() {
            delete rawChainCallbacks[chainId]
            postToExtension({
              origin: "substrate-connect-client",
              type: "remove-chain",
              chainId,
            })
          },
        }
      }
    }),
  }
}

const removeArrayItem = <T>(array: T[], item: T) => {
  array.splice(array.indexOf(item), 1)
}
