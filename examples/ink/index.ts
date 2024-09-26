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
  console.log("Get NFT")
  const nftMessage = escrowBuilder.buildMessage("get_nft")

  const result = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.escrow,
    0n,
    { ref_time: 135482165n, proof_size: 18838n },
    undefined,
    Binary.fromBytes(nftMessage.call.enc({})),
  )

  if (result.result.success) {
    console.log(nftMessage.value.dec(result.result.value.data.asBytes()))
  } else {
    console.log(result.result.value)
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
    { ref_time: 135482165n * 2n, proof_size: 18838n * 2n },
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
