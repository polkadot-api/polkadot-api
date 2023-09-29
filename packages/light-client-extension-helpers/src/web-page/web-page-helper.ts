import { ProviderStatus } from "@polkadot-api/json-rpc-provider"
import {
  ToExtension,
  ToExtensionRequest,
  ToPage,
  ToPageResponse,
} from "@/protocol"
import type { LightClientProvider, RawChain } from "./types"
import { CONTEXT } from "@/shared"

export * from "./types"

function postToExtension(msg: ToExtension) {
  window.postMessage(msg, "*")
}

function checkMessage(msg: any): msg is ToPage {
  if (!msg) return false
  if (msg?.origin !== CONTEXT.CONTENT_SCRIPT) return false
  if (!msg?.type && !msg?.id) return false
  return true
}

window.addEventListener("message", ({ data, source }) => {
  if (source !== window) return
  if (data?.origin !== CONTEXT.CONTENT_SCRIPT) return
  if (!checkMessage(data)) return console.warn("Unrecognized message", data)
  if (data.id !== undefined) return handleResponse(data)
  if (data.type === "onAddChains")
    return chainsChangeCallbacks.forEach((cb) =>
      // FIXME: implement connect with getOrCreateRawChain
      cb({
        ...data.chains,
        // @ts-ignore
        connect() {},
      }),
    )
  if (data.type === "rpc" && rawChainCallbacks[data.genesisHash])
    return rawChainCallbacks[data.genesisHash]?.onMessage.forEach((cb) =>
      cb(data.msg),
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
    const chain = await requestReply<{ name: string; genesisHash: string }>({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      type: "addChain",
      chainSpec: chainSpec,
    })

    return getOrCreateRawChain(chain)
  },
  async getChains() {
    const chains = await requestReply<{ name: string; genesisHash: string }[]>({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      type: "getChains",
    })
    return Object.entries(chains).reduce(
      (acc, [key, chain]) => {
        acc[key] = getOrCreateRawChain(chain)
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
  {
    onMessage: ((msg: string) => void)[] // TODO: Should it be an array?
    onStatusChange: ((status: ProviderStatus) => void)[] // TODO: Should it be an array?
  }
> = {}

const getOrCreateRawChain = ({
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
      rawChainCallbacks[genesisHash] ??= { onMessage: [], onStatusChange: [] }
      rawChainCallbacks[genesisHash].onMessage.push(onMessage)
      rawChainCallbacks[genesisHash].onStatusChange.push(onStatusChange)
      return {
        send(msg) {
          postToExtension({
            origin: CONTEXT.WEB_PAGE,
            type: "rpc",
            genesisHash,
            msg,
          })
        },
        disconnect() {
          // FIXME: notify extension
          // postToExtension({
          //   origin: CONTEXT.WEB_PAGE,
          //   type: "disconnect",
          //   genesisHash,
          // })
          removeArrayItem(rawChainCallbacks[genesisHash].onMessage, onMessage)
          removeArrayItem(
            rawChainCallbacks[genesisHash].onStatusChange,
            onStatusChange,
          )
        },
      }
    },
  }
}

const removeArrayItem = <T>(array: T[], item: T) => {
  array.splice(array.indexOf(item), 1)
}
