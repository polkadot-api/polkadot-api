const { createClient } = require("@polkadot-api/client")
const { ksm } = require("@polkadot-api/descriptors")
const { getLegacyProvider } = require("@polkadot-api/legacy-polkadot-provider")
const { createScClient } = require("@substrate/connect")

const { relayChains } = getLegacyProvider(createScClient())

const chain = relayChains.ksmcc3
const client = createClient(chain.provider)
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
