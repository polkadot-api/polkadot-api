import { contracts, MultiAddress, testAzero } from "@polkadot-api/descriptors"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getInkClient } from "polkadot-api/ink"
import { getPolkadotSigner } from "polkadot-api/signer"
import { createWsClient } from "polkadot-api/ws"

const alice_mnemonic =
  "bottom drive obey lake curtain smoke basket hold race lonely fit walk"
const entropy = mnemonicToEntropy(alice_mnemonic)
const miniSecret = entropyToMiniSecret(entropy)
const derive = sr25519CreateDerive(miniSecret)
const alice = derive("//Alice")
const signer = getPolkadotSigner(alice.publicKey, "Sr25519", alice.sign)

const ADDRESS = {
  alice: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  escrow: "5FGWrHpqd3zzoVdbvuRvy1uLdDe22YaSrtrFLxRWHihZMmuL",
  psp22: "5F69jP7VwzCp6pGZ93mv9FkAhwnwz4scR4J9asNeSgFPUGLq",
}

const client = createWsClient("wss://aleph-zero-testnet-rpc.dwellir.com")

const typedApi = client.getTypedApi(testAzero)

const escrow = getInkClient(contracts.escrow)
const psp22 = getInkClient(contracts.psp22)

// Storage query
{
  console.log("Query storage of contract")
  const storage = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.escrow,
    escrow.storage().encode(),
  )

  console.log(
    "storage",
    storage.success ? storage.value?.asHex() : storage.value,
  )

  if (storage.success && storage.value) {
    const decoded = escrow.storage().decode(storage.value)
    console.log("storage nft", decoded.nft)
    console.log("storage price", decoded.price)
    console.log("storage seller", decoded.seller)
  }
}

{
  console.log("Query psp22 storage")

  const rootCodecs = psp22.storage()
  let result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    rootCodecs.encode(),
  )
  console.log(
    "root result",
    result.success && result.value && rootCodecs.decode(result.value),
  )

  const lazyCodecs = psp22.storage("lazy")
  result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    lazyCodecs.encode(),
  )
  console.log(
    "lazy result",
    result.success && result.value && lazyCodecs.decode(result.value),
  )

  const balancesCodecs = psp22.storage("data.balances")
  result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    balancesCodecs.encode(ADDRESS.alice),
  )
  console.log(
    "balances result",
    result.success && result.value && balancesCodecs.decode(result.value),
  )

  const vecLenCodecs = psp22.storage("vec.len")
  result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    vecLenCodecs.encode(),
  )
  console.log(
    "vec len result",
    result.success && result.value && vecLenCodecs.decode(result.value),
  )

  const vecCodecs = psp22.storage("vec")
  result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    vecCodecs.encode(0),
  )
  console.log(
    "vec result",
    result.success && result.value && vecCodecs.decode(result.value),
  )

  const allowancesCodecs = psp22.storage("data.allowances")
  result = await typedApi.apis.ContractsApi.get_storage(
    ADDRESS.psp22,
    allowancesCodecs.encode([ADDRESS.alice, ADDRESS.alice]),
  )
  console.log(
    "allowances result",
    result.success && result.value && allowancesCodecs.decode(result.value),
  )
}

// Send non-payable message
{
  console.log("IncreaseAllowance")
  const increaseAllowance = psp22.message("PSP22::increase_allowance")

  const data = increaseAllowance.encode({
    spender: ADDRESS.psp22,
    delta_value: 1n,
  })
  const response = await typedApi.apis.ContractsApi.call(
    ADDRESS.alice,
    ADDRESS.psp22,
    0n,
    undefined,
    undefined,
    data,
  )

  if (response.result.success) {
    console.log(increaseAllowance.decode(response.result.value))
    console.log(psp22.event.filter(ADDRESS.psp22, response.events))

    // Sending the reel deel
    const result = await typedApi.tx.Contracts.call({
      value: 0n,
      data,
      dest: MultiAddress.Id(ADDRESS.psp22),
      gas_limit: response.gas_required,
      storage_deposit_limit: undefined,
    }).signAndSubmit(signer)

    console.log("tx events", psp22.event.filter(ADDRESS.psp22, result.events))
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
