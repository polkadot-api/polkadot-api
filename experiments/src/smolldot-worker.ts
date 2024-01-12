import { Worker } from "node:worker_threads"
import { ConnectProvider, WellKnownChain } from "@polkadot-api/sc-provider"

const PROVIDER_WORKER_CODE = `
const { parentPort, workerData } = require("node:worker_threads")
const { getScProvider } = require("@polkadot-api/sc-provider")

const chain = workerData
const scProvider = getScProvider()
const getProvider = scProvider(chain).relayChain

if (!parentPort) {
  throw new Error("no parent port")
}

const provider = getProvider(
  (msg) => parentPort.postMessage(msg)
)

parentPort.on("message", (msg) => {
  switch (msg.type) {
    case "send":
      provider.send(msg.value)
      break
    case "disconnect":
      provider.disconnect()
  }
})
`

const providers: Record<string, ConnectProvider> = {}

export const createProvider = (chain: WellKnownChain): ConnectProvider => {
  if (!providers[chain]) {
    let worker: Worker | null = new Worker(PROVIDER_WORKER_CODE, {
      eval: true,
      workerData: chain,
      stderr: true,
      stdout: true,
    })
    providers[chain] = (onMsg) => {
      if (worker) {
        worker.on("message", onMsg)
      }

      return {
        send: (msg) => worker?.postMessage({ type: "send", value: msg }),
        disconnect: () => {
          if (!worker) return

          worker.postMessage({ type: "disconnect" })
          worker.removeAllListeners()
          worker.terminate()
          worker = null
        },
      }
    }
  }

  return providers[chain]
}
