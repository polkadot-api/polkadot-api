const { createClient } = require("@polkadot-api/client")
const { ksm } = require("@polkadot-api/descriptors")
const { getScProvider } = require("@polkadot-api/sc-provider")
const { WellKnownChain, createScClient } = require("@substrate/connect")

const scProvider = getScProvider(createScClient())

const client = createClient(scProvider(WellKnownChain.ksmcc3).relayChain)

const testApi = client.getTypedApi(ksm)

async function run() {
  const nominationsQuotaIsCompatible =
    await testApi.apis.StakingApi.nominations_quota.isCompatible()
  console.log({ nominationsQuotaIsCompatible })

  const runtime = await testApi.runtime.latest()

  const auctionEndingIsCompatible =
    testApi.constants.Auctions.EndingPeriod.isCompatible(runtime)

  console.log({ auctionEndingIsCompatible })

  if (auctionEndingIsCompatible) {
    console.log(testApi.constants.Auctions.EndingPeriod(runtime))
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  client.destroy()
}

run()
