import { contracts, testAzero } from "@polkadot-api/descriptors"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { Binary, createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getPolkadotSigner } from "polkadot-api/signer"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { ADDRESS } from "./address"
import { createInkSdk } from "./sdk/ink-sdk"

const alice_mnemonic =
  "bottom drive obey lake curtain smoke basket hold race lonely fit walk"
const entropy = mnemonicToEntropy(alice_mnemonic)
const miniSecret = entropyToMiniSecret(entropy)
const derive = sr25519CreateDerive(miniSecret)
const alice = derive("//Alice")
const signer = getPolkadotSigner(alice.publicKey, "Sr25519", alice.sign)

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://aleph-zero-testnet-rpc.dwellir.com"),
  ),
)

const typedApi = client.getTypedApi(testAzero)

const escrowSdk = createInkSdk(typedApi, contracts.escrow)

const escrowContract = escrowSdk.getContract(ADDRESS.escrow)

const psp22Sdk = createInkSdk(typedApi, contracts.psp22)
const psp22Contract = psp22Sdk.getContract(ADDRESS.psp22)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await escrowContract.getRootStorage()

  if (storage.success && storage.value) {
    console.log("storage nft", storage.value.nft)
    console.log("storage price", storage.value.price)
    console.log("storage seller", storage.value.seller)
  } else {
    console.log("error", storage.value)
  }
}

// Query for some information through a message
{
  console.log("get_nft")
  const result = await escrowContract.query("get_nft", {
    origin: ADDRESS.alice,
  })

  if (result.success) {
    console.log("id", result.value.response.id)
    console.log("owner", result.value.response.owner)
    console.log("events", result.value.events)
  } else {
    console.log("error", result.value)
  }
}

// Dry run
{
  console.log("IncreaseAllowance")
  const result = await psp22Contract.query("PSP22::increase_allowance", {
    origin: ADDRESS.alice,
    data: {
      spender: ADDRESS.psp22,
      delta_value: 1000000n,
    },
  })

  if (result.success) {
    console.log("IncreaseAllowance success")
    console.log("events", result.value.events)
  } else {
    console.log("error", result.value)
  }
}

// Send payable message
{
  console.log("Deposit 100 funds")
  const result = await escrowContract.query("deposit_funds", {
    origin: ADDRESS.alice,
    value: 100_000_000_000_000n,
  })

  if (result.success) {
    console.log("deposit funds success")
    console.log("events", result.value.events)
  } else {
    console.log("error", result.value)
  }
}

{
  console.log("Perform transaction")
  const value = 100_000_000_000_000n

  console.log("dry run")
  const result = await escrowContract.query("deposit_funds", {
    origin: ADDRESS.alice,
    value,
  })

  if (result.success) {
    console.log("dry run success", result)
    //   console.log("sending transaction")
    //   const result = await escrowContract
    //     .send("deposit_funds", {
    //       origin: ADDRESS.alice,
    //       value,
    //     })
    //     .signAndSubmit(signer)
    //   if (!result.ok) {
    //     console.log("error", result.dispatchError)
    //   } else {
    //     console.log(result)
    //   }
  } else {
    console.log("error", result.value)
  }
}

{
  console.log("Redeploy contract")
  const result = await escrowContract.dryRunRedeploy("new", {
    data: {
      nft: 1,
      price: 100n,
    },
    origin: ADDRESS.alice,
    options: {
      salt: Binary.fromHex("0x00"),
    },
  })

  if (result.success) {
    console.log("redeploy dry run", result)

    // const result = await escrowContract
    //   .redeploy("new", {
    //     data: {
    //       nft: 1,
    //       price: 100n,
    //     },
    //     origin: ADDRESS.alice,
    //     options: {
    //       salt: Binary.fromHex("0x00"),
    //     },
    //   })
    //   .signAndSubmit(signer)

    // const deployment = escrowSdk.readDeploymentEvents(
    //   ADDRESS.alice,
    //   result.events,
    // )
    // console.log("deployment", deployment)
  } else {
    console.log(result.value)
  }
}

client.destroy()
