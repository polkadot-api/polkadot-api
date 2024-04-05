import { createClient } from "@polkadot-api/client"
import { wnd } from "@polkadot-api/descriptors"
import { getScProvider } from "@polkadot-api/sc-provider"
import { WellKnownChain, createScClient } from "@substrate/connect"

const scProvider = getScProvider(createScClient({}))

const client = createClient(scProvider(WellKnownChain.westend2).relayChain)
const testApi = client.getTypedApi(wnd)

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

await run()
process.exit(0)
