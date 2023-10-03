import type {
  ToExtension,
  ToExtensionRequest,
  ToPage,
  ToPageResponse,
} from "@/protocol"
import { CONTEXT } from "@/shared"
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
          Object.entries(data.chains).map(([key, chain]) => [
            key,
            // FIXME: chainSpec should be internal to content-script-helper
            // @ts-ignore
            createRawChain(chain),
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
  async addChain(chainSpec) {
    return createRawChain(
      await requestReply<{
        name: string
        genesisHash: string
        // FIXME: this should be internal to content-script-helper
        chainSpec: string
      }>({
        origin: CONTEXT.WEB_PAGE,
        id: nextId(),
        type: "addChain",
        chainSpec,
      }),
    )
  },
  async getChains() {
    const chains = await requestReply<
      {
        name: string
        genesisHash: string
        // FIXME: this should be internal to content-script-helper
        chainSpec: string
      }[]
    >({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      type: "getChains",
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
  chainSpec,
}: {
  name: string
  genesisHash: string
  // FIXME: this should be internal to content-script-helper
  chainSpec: string
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
        type: "add-chain",
        chainId,
        // FIXME: this should be internal to content-script-helper
        chainSpec,
        // FIXME: handle potential relay chains
        potentialRelayChainIds: [],
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
          onStatusChange("disconnected")
        },
      }
    },
  }
}

const removeArrayItem = <T>(array: T[], item: T) => {
  array.splice(array.indexOf(item), 1)
}

const getRandomChainId = () => {
  const arr = new BigUint64Array(2)
  // It can only be used from the browser, so this is fine.
  crypto.getRandomValues(arr)
  const result = (arr[1]! << BigInt(64)) | arr[0]!
  return result.toString(36)
}
