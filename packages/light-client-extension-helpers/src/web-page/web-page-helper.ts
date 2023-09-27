import { ToExtension, ToPage } from "@/protocol"
import { LightClientProvider } from "./types"

function postToExtension(msg: ToExtension) {
  console.log({ msg })
  window.postMessage(msg, "*")
}

function checkMessage(msg: any): msg is ToPage {
  if (!msg) return false
  if (msg?.origin !== "content-script-helper") return false
  // FIXME: is is optional for notificatios "onChainsChange"
  if (!msg?.id) return false
  return true
}

window.addEventListener("message", ({ data, source, origin }) => {
  console.log("web-page onMessage", { data })
  if (source !== window) return
  if (data?.origin !== "content-script-helper") return
  if (!checkMessage(data)) {
    console.warn("Malformed message - unrecognised message", data)
    return
  }

  console.log({ data, origin })
  // FIXME: handle notifications without id for "onChainsChange"
  const pendingRequest = pendingRequests[data.id]
  if (!pendingRequest) console.warn("unhandled response", data)
  data.error
    ? pendingRequest.reject(data.error)
    : pendingRequest.resolve(data.result)
  delete pendingRequests[data.id]
})

const chainsChangeCallbacks: Parameters<
  LightClientProvider["onChainsChange"]
>[0][] = []

const pendingRequests: Record<
  string,
  { resolve(result: any): void; reject(error: any): void }
> = {}
// FIXME: improve id generation
let nextId = 0
const requestReply = (method: string, params?: any[]): Promise<any> => {
  const id = "" + nextId++
  const promise = new Promise((resolve, reject) => {
    pendingRequests[id] = { resolve, reject }
  })
  postToExtension({
    origin: "web-page-helper",
    id,
    method,
    params,
  })
  return promise
}

export const provider: LightClientProvider = {
  async addChain(chainspec) {
    console.log("addChain", { chainspec })

    // FIXME: handle errors
    return requestReply("addChain", [chainspec])
  },
  async getChains() {
    console.log("getChains")

    // FIXME: handle errors
    return requestReply("getChains")
  },
  onChainsChange(callback) {
    console.log("onChainsChange")

    chainsChangeCallbacks.push(callback)
    return () => {
      chainsChangeCallbacks.splice(chainsChangeCallbacks.indexOf(callback), 1)
    }
  },
}
