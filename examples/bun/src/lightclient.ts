import { CompatibilityLevel, createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { chainSpec } from "polkadot-api/chains/westend2"
import { wnd } from "@polkadot-api/descriptors"

const smoldot = start()

const client = createClient(getSmProvider(smoldot.addChain({ chainSpec })))
const testApi = client.getTypedApi(wnd)

const isCompatible = (level: CompatibilityLevel) =>
  level >= CompatibilityLevel.BackwardsCompatible

async function run() {
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

  client.destroy()
  smoldot.terminate()
}

await run()
process.exit(0)
