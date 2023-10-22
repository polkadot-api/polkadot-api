export const PROVIDER_WORKER_CODE = `
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
