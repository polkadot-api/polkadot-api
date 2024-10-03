import { contracts, testAzero } from "@polkadot-api/descriptors"
import { Binary, createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { ADDRESS, aliceSigner } from "./address"
import { createInkSdk } from "./sdk/ink-sdk"

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://aleph-zero-testnet-rpc.dwellir.com"),
  ),
)

const typedApi = client.getTypedApi(testAzero)

const escrowSdk = createInkSdk(typedApi, contracts.escrow)
const escrowContract = escrowSdk.getContract(ADDRESS.escrow)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await createInkSdk(typedApi, contracts.escrow)
    .getContract(ADDRESS.escrow)
    .getRootStorage()

  if (storage.success && storage.value) {
    console.log("storage", storage.value)
  } else {
    console.log("error", storage.value)
  }
}

// Dry run
{
  console.log("Deposit funds")
  const result = await escrowContract.query("deposit_funds", {
    origin: ADDRESS.alice,
    value: 100_000_000_000_000n,
  })

  if (result.success) {
    console.log("Deposit funds success")
    console.log("events", result.value.events)
  } else {
    console.log("error", result.value)
  }
}

// Redeploy contract
{
  console.log("Redeploy contract")
  const data = {
    nft: 3,
    price: 50_000_000_000n,
  }
  const result = await escrowContract.dryRunRedeploy("new", {
    data,
    origin: ADDRESS.alice,
  })

  if (result.success) {
    console.log("dry run success")
    const result = await escrowContract
      .redeploy("new", {
        data,
        origin: ADDRESS.alice,
        // options: {
        //   salt: Binary.fromHex("0x01"),
        // },
      })
      .signAndSubmit(aliceSigner)

    const deployment = escrowSdk.readDeploymentEvents(
      ADDRESS.alice,
      result.events,
    )
    console.log("deployment", deployment)
  } else {
    console.log(result.value)
  }
}

client.destroy()
