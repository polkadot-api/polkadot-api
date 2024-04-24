export const PROVIDER_WORKER_CODE = `
const { start } = require("@polkadot-api/smoldot")
const { parentPort, workerData } = require("node:worker_threads")
const { getSmProvider } = require("@polkadot-api/sm-provider")

if (!parentPort) throw new Error("no parent port")

const WELL_KNOWN_CHAINS_LIB = "@polkadot-api/known-chains/"
const wellKnownChains = new Set([
  "polkadot",
  "ksmcc3",
  "rococo_v2_2",
  "westend2",
])

const smoldot = start()

const getProvider = (chainSpec) => {
  const { relay_chain } = JSON.parse(chainSpec)

  if (!relay_chain)
    return getSmProvider(
      smoldot.addChain({
        chainSpec,
      }),
    )

  if (!wellKnownChains.has(relay_chain))
    throw new Error("Relay chain " + relay_chain + " is not well-known")

  const relayP = smoldot.addChain({
    chainSpec: require(WELL_KNOWN_CHAINS_LIB + relay_chain).chainSpec,
    disableJsonRpc: true,
  })

  return getSmProvider(
    relayP.then((relay) =>
      smoldot.addChain({
        potentialRelayChains: [relay],
        chainSpec,
      }),
    ),
  )
}

const provider = getProvider(
  wellKnownChains.has(workerData)
    ? require(WELL_KNOWN_CHAINS_LIB + workerData).chainSpec
    : workerData,
)((msg) => parentPort.postMessage(msg))

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
