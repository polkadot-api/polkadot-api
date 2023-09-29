import { ToExtension, ToPage, ToPageResponse } from "@/protocol"
import type { LightClientProvider } from "./types"
import { CONTEXT } from "@/shared"

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
      cb({
        ...data.chains,
        // FIXME: implement connect
        // @ts-ignore
        connect() {},
      }),
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

const requestReply = (msg: ToExtension): Promise<any> => {
  const promise = new Promise((resolve, reject) => {
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
  async addChain(chainspec) {
    return requestReply({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      type: "addChain",
      chainspec,
    })
  },
  async getChains() {
    return requestReply({
      origin: CONTEXT.WEB_PAGE,
      id: nextId(),
      type: "getChains",
    })
  },
  onChainsChange(callback) {
    chainsChangeCallbacks.push(callback)
    return () => {
      chainsChangeCallbacks.splice(chainsChangeCallbacks.indexOf(callback), 1)
    }
  },
}
