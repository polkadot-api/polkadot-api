import { CompatibilityLevel } from "polkadot-api"
import { getMetadata, wnd } from "@polkadot-api/descriptors"
import { createWsClient } from "polkadot-api/ws"

const client = createWsClient("wss://westend-rpc.polkadot.io", { getMetadata })
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
