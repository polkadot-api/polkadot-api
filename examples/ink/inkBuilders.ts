import { contracts, testAzero } from "@polkadot-api/descriptors"
import { getInkDynamicBuilder, getInkLookup } from "@polkadot-api/ink-contracts"
import { Binary, createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { ADDRESS } from "./address"

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://aleph-zero-testnet-rpc.dwellir.com"),
  ),
)

const typedApi = client.getTypedApi(testAzero)
const lookup = getInkLookup(contracts.escrow.metadata)
const builders = getInkDynamicBuilder(lookup)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.escrow,
    Binary.fromHex(contracts.escrow.metadata.storage.root.root_key),
  )

  if (storage.success && storage.value) {
    const decoded = getInkDynamicBuilder(
      getInkLookup(contracts.escrow.metadata),
    )
      .buildStorageRoot()
      .dec(storage.value.asBytes())
    console.log("storage", decoded)
  } else {
    console.log("error", storage.value)
  }
}

// Dry run
{
  console.log("Deposit funds")
  const depositFunds = builders.buildMessage("deposit_funds")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.escrow,
    100_000_000_000_000n,
    undefined,
    undefined,
    Binary.fromBytes(depositFunds.call.enc({})),
  )

  if (result.result.success) {
    console.log("IncreaseAllowance success")
    const decoded = depositFunds.value.dec(result.result.value.data.asBytes())
    console.log("result", decoded)

    const eventCodec = builders.buildEvent()
    const events = result.events
      ?.map((e) => {
        if (
          e.event.type === "Contracts" &&
          e.event.value.type === "ContractEmitted" &&
          e.event.value.value.contract === ADDRESS.escrow
        ) {
          return eventCodec.dec(e.event.value.value.data.asBytes())
        }
        return null
      })
      .filter((v) => v != null)
    console.log("events", events)
  } else {
    console.log("error", result.result.value)
  }
}

client.destroy()
