import { contracts, testAzero } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getInkClient } from "polkadot-api/ink"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"

const ADDRESS = {
  alice: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  escrow: "5FGWrHpqd3zzoVdbvuRvy1uLdDe22YaSrtrFLxRWHihZMmuL",
  psp22: "5EtyZ1urgUdR5h1RAVfgKgHtFv8skaM1YN5Gv4HJya361dLq",
}

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://aleph-zero-testnet-rpc.dwellir.com"),
  ),
)

const typedApi = client.getTypedApi(testAzero)
const escrow = getInkClient(contracts.escrow)
const psp22 = getInkClient(contracts.psp22)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.escrow,
    escrow.storage.rootKey,
  )

  console.log(
    "storage",
    storage.success ? storage.value?.asHex() : storage.value,
  )

  if (storage.success && storage.value) {
    const decoded = escrow.storage.decodeRoot(storage.value)
    console.log("storage nft", decoded.nft)
    console.log("storage price", decoded.price)
    console.log("storage seller", decoded.seller)
  }
}

// Send non-payable message
{
  console.log("IncreaseAllowance")
  const increaseAllowance = psp22.message("PSP22::increase_allowance")

  const response = await typedApi.apis.ContractsApi.call(
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

  if (response.result.success) {
    console.log(increaseAllowance.decode(response.result.value))
    console.log(psp22.event.filter(ADDRESS.psp22, response.events))
  } else {
    console.log(
      response.result.value,
      response.gas_consumed,
      response.gas_required,
    )
  }
}

// Send payable message
{
  console.log("Deposit 100 funds")
  const depositFunds = escrow.message("deposit_funds")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.escrow,
    100_000_000_000_000n,
    undefined,
    undefined,
    depositFunds.encode(),
  )

  if (result.result.success) {
    const decoded = depositFunds.decode(result.result.value)
    if (decoded.success) {
      console.log("outer success")
      if (!decoded.value.success) {
        console.log("inner error", decoded.value.value.type)
      }
    } else {
      console.log("outer error", decoded.value.type)
    }
  } else {
    console.log(result.result.value, result.gas_required)
  }
}

client.destroy()
