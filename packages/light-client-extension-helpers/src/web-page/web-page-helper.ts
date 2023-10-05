import type {
  ToExtension,
  ToExtensionRequest,
  ToPage,
  ToPageResponse,
} from "@/protocol"
import { CONTEXT, getRandomChainId } from "@/shared"
import type { LightClientProvider, RawChain } from "./types"

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
  LightClientProvider["onChainsChange"]
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
export const provider: LightClientProvider = {
  async addChain(chainSpec, relayChainGenesisHash) {
    return createRawChain(
      await requestReply<{
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
      }),
    )
  },
  async getChains() {
    const chains = await requestReply<
      {
        name: string
        genesisHash: string
      }[]
    >({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      request: {
        type: "getChains",
      },
    })
    return Object.entries(chains).reduce(
      (acc, [key, chain]) => {
        acc[key] = createRawChain(chain)
        return acc
      },
      {} as Record<string, RawChain>,
    )
  },
  onChainsChange(callback) {
    chainsChangeCallbacks.push(callback)
    return () => {
      removeArrayItem(chainsChangeCallbacks, callback)
    }
  },
}

const rawChainCallbacks: Record<
  string,
  (msg: ToPage & { origin: "substrate-connect-extension" }) => void
> = {}

const createRawChain = ({
  name,
  genesisHash,
}: {
  name: string
  genesisHash: string
}): RawChain => {
  return {
    name,
    genesisHash,
    async connect(onMessage, onStatusChange) {
      const chainId = getRandomChainId()
      const pendingJsonRpcMessages: string[] = []
      let isReady = false
      rawChainCallbacks[chainId] = (msg) => {
        switch (msg.type) {
          case "error": {
            delete rawChainCallbacks[chainId]
            onStatusChange("disconnected")
            break
          }
          case "rpc": {
            onMessage(msg.jsonRpcMessage)
            break
          }
          case "chain-ready": {
            isReady = true
            pendingJsonRpcMessages.forEach((jsonRpcMessage) =>
              postToExtension({
                origin: "substrate-connect-client",
                type: "rpc",
                chainId,
                jsonRpcMessage,
              }),
            )
            pendingJsonRpcMessages.length = 0
            onStatusChange("connected")
            break
          }
          default:
            const unrecognizedMsg: never = msg
            console.warn("Unrecognized message", unrecognizedMsg)
            break
        }
      }

      postToExtension({
        origin: "substrate-connect-client",
        type: "add-well-known-chain",
        chainId,
        chainName: genesisHash,
      })

      return {
        send(jsonRpcMessage) {
          if (!isReady) {
            pendingJsonRpcMessages.push(jsonRpcMessage)
            return
          }
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
          // TODO: validate, Should onStatusChange be invoked on .disconnect()?
          // onStatusChange("disconnected")
        },
      }
    },
  }
}

const removeArrayItem = <T>(array: T[], item: T) => {
  array.splice(array.indexOf(item), 1)
}
