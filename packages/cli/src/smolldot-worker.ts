export const PROVIDER_WORKER_CODE = `
const { parentPort, workerData } = require("node:worker_threads")
const { getScProvider } = require("@polkadot-api/sc-provider")
const { WellKnownChain } = require("@substrate/connect")
const wellKnownChains = new Set(Object.values(WellKnownChain))
const isWellKnownChain = (input) => wellKnownChains.has(input)

if (!parentPort) {
  throw new Error("no parent port")
}

const chain = workerData
const scProvider = getScProvider()
const getProvider = isWellKnownChain(chain)
  ? scProvider(chain).relayChain
  : (() => {
      const parsedSpec = JSON.parse(chain)
      if (parsedSpec.relay_chain) {
        if (!isWellKnownChain(parsedSpec.relay_chain)) {
          throw new Error(
            "Relay chain " + parsedSpec.relay_chain + " is not well-known",
          )
        }
        const provider = scProvider(parsedSpec.relay_chain)
        return provider.addParachain(chain)
      } else {
        return scProvider(chain).relayChain
      }
    })()

const provider = getProvider((msg) => parentPort.postMessage(msg))
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
