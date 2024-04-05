import { createClient } from "@polkadot-api/client"
import { wnd } from "@polkadot-api/descriptors"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { WebSocketProvider } from "@polkadot-api/ws-provider/node"

const polkadotProvider = await getChain({
  provider: WebSocketProvider("wss://westend-rpc.polkadot.io"),
  keyring: [],
})

const client = createClient(polkadotProvider)
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
