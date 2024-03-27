import { createClient } from "@polkadot-api/client"
import { ksm } from "@polkadot-api/client/descriptors"
import { getLegacyProvider } from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"

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
