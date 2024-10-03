import { contracts, testAzero } from "@polkadot-api/descriptors"
import { getInkClient } from "@polkadot-api/ink-contracts"
import { createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { ADDRESS } from "./address"

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://aleph-zero-testnet-rpc.dwellir.com"),
  ),
)

const typedApi = client.getTypedApi(testAzero)
const escrowClient = getInkClient(contracts.escrow)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.escrow,
    escrowClient.storage.rootKey,
  )

  if (storage.success && storage.value) {
    const decoded = escrowClient.storage.decodeRoot(storage.value)
    console.log("storage", decoded)
  } else {
    console.log("error", storage.value)
  }
}

// Dry run
{
  console.log("Deposit funds")
  const depositFunds = escrowClient.message("deposit_funds")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.escrow,
    100_000_000_000_000n,
    undefined,
    undefined,
    depositFunds.encode(),
  )

  if (result.result.success) {
    console.log("IncreaseAllowance success")
    const decoded = depositFunds.decode(result.result.value)
    console.log("result", decoded)

    const events = escrowClient.event.filter(ADDRESS.escrow, result.events)
    console.log("events", events)
  } else {
    console.log("error", result.result.value)
  }
}

client.destroy()
