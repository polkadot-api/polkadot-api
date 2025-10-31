import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { chainSpec } from "polkadot-api/chains/westend2"
import { wnd } from "@polkadot-api/descriptors"

const smoldot = start()

const client = createClient(
  getSmProvider(() => smoldot.addChain({ chainSpec })),
)
const testApi = client.getTypedApi(wnd)

async function run() {
  const { compat, const: cnst } = await testApi.getStaticApis()
  const nominationsQuotaIsCompatible =
    compat.api.StakingApi.nominations_quota.isCompatible()

  console.log({ nominationsQuotaIsCompatible })

  const auctionEndingIsCompatible =
    compat.const.Auctions.EndingPeriod.isCompatible()

  console.log({ auctionEndingIsCompatible })

  if (auctionEndingIsCompatible) {
    console.log(cnst.Auctions.EndingPeriod)
  }

  client.destroy()
  smoldot.terminate()
}

await run()
process.exit(0)
