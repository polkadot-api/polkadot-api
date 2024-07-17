import { CompatibilityLevel, createClient } from "polkadot-api"
import { WebSocketProvider } from "polkadot-api/ws-provider/node"
import { wnd } from "@polkadot-api/descriptors"

const client = createClient(WebSocketProvider("wss://westend-rpc.polkadot.io"))
const testApi = client.getTypedApi(wnd)

const isCompatible = (level: CompatibilityLevel) =>
  level >= CompatibilityLevel.BackwardsCompatible

async function run() {
  const nominationsQuotaIsCompatible = isCompatible(
    await testApi.apis.StakingApi.nominations_quota.getCompatibilityLevel(),
  )
  console.log({ nominationsQuotaIsCompatible })

  const runtime = await testApi.runtime.latest()

  const auctionEndingIsCompatible = isCompatible(
    testApi.constants.Auctions.EndingPeriod.getCompatibilityLevel(runtime),
  )

  console.log({ auctionEndingIsCompatible })

  if (auctionEndingIsCompatible) {
    console.log(testApi.constants.Auctions.EndingPeriod(runtime))
  }

  client.destroy()
}

await run()
process.exit(0)
