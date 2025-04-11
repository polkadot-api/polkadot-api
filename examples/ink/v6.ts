import { contracts, MultiAddress, wndAh } from "@polkadot-api/descriptors"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { AccountId, Binary, createClient, Enum } from "polkadot-api"
import { getInkClient } from "polkadot-api/ink"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getPolkadotSigner } from "polkadot-api/signer"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { lastValueFrom, tap } from "rxjs"

const alice_mnemonic =
  "bottom drive obey lake curtain smoke basket hold race lonely fit walk"
const entropy = mnemonicToEntropy(alice_mnemonic)
const miniSecret = entropyToMiniSecret(entropy)
const derive = sr25519CreateDerive(miniSecret)
const alice = derive("//Alice")
const signer = getPolkadotSigner(alice.publicKey, "Sr25519", alice.sign)

const ADDRESS = {
  alice: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  myContract: Binary.fromHex("0x163ab0d57c80c1954c522ef1253ba55da5a0d8af"),
}

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider([
      "wss://asset-hub-westend-rpc.dwellir.com",
      //   "wss://rpc1.paseo.popnetwork.xyz",
      //   "wss://rpc2.paseo.popnetwork.xyz",
      //   "wss://rpc3.paseo.popnetwork.xyz",
    ]),
  ),
)

const typedApi = client.getTypedApi(wndAh)
const myContract = getInkClient(contracts.my_contract)

// Storage query
/* TODO not working:
1. Key length mismatches, metadata has 4 bytes, runtime call expects fixed-size 32
2. Padding with 0s gives back "None", as if no storage value is there.
*/
// {
//   console.log(
//     "Query storage of contract",
//     myContract.storage().encode().asHex(),
//   )
//   const storage = await typedApi.apis.ReviveApi.get_storage(
//     ADDRESS.myContract,
//     myContract.storage().encode(),
//   )

//   console.log(
//     "storage",
//     storage.success ? storage.value?.asHex() : storage.value,
//   )

//   if (storage.success && storage.value) {
//     const decoded = myContract.storage().decode(storage.value)
//     console.log("decoded value", decoded)
//   }
// }

// Send non-payable message
{
  console.log("Flip")
  const getMsg = myContract.message("get")
  const flipMsg = myContract.message("flip")

  const initialGet = await typedApi.apis.ReviveApi.call(
    ADDRESS.alice,
    ADDRESS.myContract,
    0n,
    undefined,
    undefined,
    getMsg.encode(),
  )
  console.log(
    "initial value",
    initialGet.result.success
      ? getMsg.decode(initialGet.result.value)
      : initialGet.result.value,
  )

  const flipDryRun = await typedApi.apis.ReviveApi.call(
    ADDRESS.alice,
    ADDRESS.myContract,
    0n,
    undefined,
    undefined,
    flipMsg.encode(),
  )

  if (flipDryRun.result.success) {
    const txResult = await typedApi.tx.Revive.call({
      value: 0n,
      data: flipMsg.encode(),
      dest: ADDRESS.myContract,
      gas_limit: flipDryRun.gas_required,
      storage_deposit_limit: flipDryRun.storage_deposit.value,
    }).signAndSubmit(signer)
    console.log("tx success", txResult.ok, txResult.dispatchError)

    const secondGet = await typedApi.apis.ReviveApi.call(
      ADDRESS.alice,
      ADDRESS.myContract,
      0n,
      undefined,
      undefined,
      getMsg.encode(),
    )
    console.log(
      "post value",
      secondGet.result.success
        ? getMsg.decode(secondGet.result.value)
        : secondGet.result.value,
    )
  } else {
    console.log("flip dry run failed", flipDryRun.result.value)
  }
}

// const constructor = myContract.constructor("default")
// const data = constructor.encode()

// const path =
//   "/Users/victor/development/my_contract/target/ink/my_contract.polkavm"
// const file = Bun.file(path)
// const code = Binary.fromBytes(await file.bytes())
// const salt = Binary.fromBytes(new Uint8Array(32))

// console.log("dry running")
// const result = await typedApi.apis.ReviveApi.instantiate(
//   ADDRESS.alice,
//   0n,
//   undefined,
//   undefined,
//   Enum("Upload", code),
//   data,
//   salt,
// )

// if (result.result.success) {
//   console.log("success", result.result.value.addr.asHex())

//   await lastValueFrom(
//     typedApi.tx.Revive.instantiate_with_code({
//       code,
//       data,
//       gas_limit: result.gas_required,
//       salt,
//       storage_deposit_limit: result.storage_deposit.value,
//       value: 0n,
//     })
//       .signSubmitAndWatch(signer)
//       .pipe(tap(console.log)),
//   )
// } else {
//   console.log("Errored", result.result.value)
// }

client.destroy()
