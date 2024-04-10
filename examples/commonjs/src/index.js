const { createClient } = require("polkadot-api")
const { ksm } = require("@polkadot-api/descriptors")
const { start } = require("polkadot-api/smoldot")
const { getSmProvider } = require("polkadot-api/sm-provider")
const { chainSpec } = require("polkadot-api/chains/ksmcc3")

const smoldot = start()

const client = createClient(getSmProvider(smoldot.addChain({ chainSpec })))

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
