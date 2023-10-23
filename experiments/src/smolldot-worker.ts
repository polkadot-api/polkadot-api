import { Worker } from "node:worker_threads"
import { ConnectProvider, WellKnownChain } from "@polkadot-api/sc-provider"

const PROVIDER_WORKER_CODE = `
const { parentPort, workerData } = require("node:worker_threads")
const { ScProvider } = require("@polkadot-api/sc-provider")

const chain = workerData
const getProvider = ScProvider(chain)

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

export const createProvider =
  (chain: WellKnownChain): ConnectProvider =>
  (onMsg) => {
    let worker: Worker | null = new Worker(PROVIDER_WORKER_CODE, {
      eval: true,
      workerData: chain,
      stderr: true,
      stdout: true,
    })
    worker.on("message", onMsg)

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
