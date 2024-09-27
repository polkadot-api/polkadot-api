import { Binary, createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getInkLookup, getInkDynamicBuilder } from "@polkadot-api/ink-contracts"
import { testAzero } from "@polkadot-api/descriptors"
import escrow from "./escrow.json"
import psp22 from "./psp22.json"

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

const escrowBuilder = getInkDynamicBuilder(getInkLookup(escrow as any))
const psp22Builder = getInkDynamicBuilder(getInkLookup(psp22 as any))

// Storage query
{
  console.log("Query storage of contract")
  const storage = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.escrow,
    Binary.fromHex(escrow.storage.root.root_key),
  )

  console.log(
    "storage",
    storage.success ? storage.value?.asHex() : storage.value,
  )

  if (storage.success && storage.value) {
    const decoded = escrowBuilder
      .buildStorageRoot()
      .dec(storage.value.asBytes())
    console.log("decoded", decoded)
  }
}

// Send non-payable message
{
  console.log("IncreaseAllowance")
  const increaseAllowance = psp22Builder.buildMessage(
    "PSP22::increase_allowance",
  )
  const psp22Event = psp22Builder.buildEvent()

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.psp22,
    0n,
    undefined,
    undefined,
    Binary.fromBytes(
      increaseAllowance.call.enc({
        spender: ADDRESS.psp22,
        delta_value: 1000000n,
      }),
    ),
  )

  if (result.result.success) {
    console.log(increaseAllowance.value.dec(result.result.value.data.asBytes()))
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
  const depositFunds = escrowBuilder.buildMessage("deposit_funds")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.escrow,
    100_000_000_000_000n,
    undefined,
    undefined,
    Binary.fromBytes(depositFunds.call.enc({})),
  )

  if (result.result.success) {
    console.log(depositFunds.value.dec(result.result.value.data.asBytes()))
  } else {
    console.log(result.result.value, result.gas_required)
  }
}

client.destroy()
