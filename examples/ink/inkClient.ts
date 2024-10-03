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
const psp22Client = getInkClient(contracts.psp22)
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
  console.log("IncreaseAllowance")
  const increaseAllowance = psp22Client.message("PSP22::increase_allowance")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.psp22,
    0n,
    undefined,
    undefined,
    increaseAllowance.encode({
      spender: ADDRESS.psp22,
      delta_value: 1000000n,
    }),
  )

  if (result.result.success) {
    console.log("IncreaseAllowance success")
    const decoded = increaseAllowance.decode(result.result.value)
    console.log("result", decoded)

    const events = psp22Client.event.filter(ADDRESS.psp22, result.events)
    console.log("events", events)
  } else {
    console.log("error", result.result.value)
  }
}

client.destroy()
