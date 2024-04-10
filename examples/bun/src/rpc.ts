import { createClient } from "@polkadot-api/client"
import { WebSocketProvider } from "@polkadot-api/client/ws-provider-node"
import { wnd } from "@polkadot-api/descriptors"

const client = createClient(WebSocketProvider("wss://westend-rpc.polkadot.io"))
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

  client.destroy()
}

await run()
process.exit(0)
