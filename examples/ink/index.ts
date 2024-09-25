import { Binary, createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import {
  getInkLookup,
  getInkDynamicBuilder,
  getInkClient,
} from "@polkadot-api/ink-contracts"
import { contracts, testAzero } from "@polkadot-api/descriptors"
import psp22Ct from "./psp22.json"

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
const psp22Builder = getInkDynamicBuilder(getInkLookup(psp22Ct as any))
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
  const psp22Event = psp22Builder.buildEvent()

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.psp22,
    0n,
    undefined,
    undefined,
    increaseAllowance.encodeMessage({
      spender: ADDRESS.psp22,
      delta_value: 1000000n,
    }),
  )

  if (result.result.success) {
    console.log(increaseAllowance.decodeResponse(result.result.value.data))
    const contractEvents = result.events
      ?.filter(
        (v) =>
          v.event.type === "Contracts" &&
          v.event.value.type === "ContractEmitted",
      )
      .map((v) => v.event.value.value as { contract: string; data: Binary })
    console.log(
      contractEvents?.map((evt) => psp22Event.dec(evt.data.asBytes())),
    )
  } else {
    console.log(result.result.value, result.gas_consumed, result.gas_required)
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
    depositFunds.encodeMessage({}),
  )

  if (result.result.success) {
    const decoded = depositFunds.decodeResponse(result.result.value.data)
    if (decoded.success) {
      console.log("outer success")
      if (decoded.value.success) {
        console.log("inner success")
      } else {
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
