const { createClient, CompatibilityLevel } = require("polkadot-api")
const { ksm } = require("@polkadot-api/descriptors")
const { start } = require("polkadot-api/smoldot")
const { getSmProvider } = require("polkadot-api/sm-provider")
const { chainSpec } = require("polkadot-api/chains/ksmcc3")

const smoldot = start()

const client = createClient(getSmProvider(smoldot.addChain({ chainSpec })))

const testApi = client.getTypedApi(ksm)

async function run() {
  const isCompatible = (level) => level > CompatibilityLevel.Incompatible
  const nominationsQuotaIsCompatible = isCompatible(
    await testApi.apis.StakingApi.nominations_quota.getCompatibilityLevel(),
  )
  console.log({ nominationsQuotaIsCompatible })

  const token = await testApi.compatibilityToken

  const auctionEndingIsCompatible = isCompatible(
    testApi.constants.Auctions.EndingPeriod.getCompatibilityLevel(token),
  )

  console.log({ auctionEndingIsCompatible })

  if (auctionEndingIsCompatible) {
    console.log(testApi.constants.Auctions.EndingPeriod(token))
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  client.destroy()
}

run()
