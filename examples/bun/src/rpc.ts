import { CompatibilityLevel, createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { cacheMetadata, wnd } from "@polkadot-api/descriptors"
import { withLogsRecorder } from "polkadot-api/logs-provider"

const client = createClient(
  withLogsRecorder(console.log, getWsProvider("wss://westend-rpc.polkadot.io")),
  cacheMetadata(),
)
const testApi = client.getTypedApi(wnd)

const isCompatible = (level: CompatibilityLevel) =>
  level >= CompatibilityLevel.BackwardsCompatible

async function run() {
  const genesisHash = await testApi.query.System.BlockHash.getValue(0)
  console.log("genesisHash", genesisHash.asHex())

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

  const chainSpecData = await client.getChainSpecData()
  console.log({ chainSpecData })

  client.destroy()
}

await run()
process.exit(0)
