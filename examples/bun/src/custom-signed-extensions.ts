import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getPolkadotSigner } from "polkadot-api/signer"
import { MultiAddress, turing } from "@polkadot-api/descriptors"
import { createWsClient } from "polkadot-api/ws"

const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)
const papiTest = derive("//Alice")
const papiTestSigner = getPolkadotSigner(
  papiTest.publicKey,
  "Sr25519",
  papiTest.sign,
)

const client = createWsClient("wss://turing-rpc.avail.so/ws")

const api = client.getTypedApi(turing)

const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
const transfer = api.tx.Balances.transfer_allow_death(
  MultiAddress.Id(BOB),
  12345n,
)

const estimatedFees = await transfer.getEstimatedFees(BOB, {
  customSignedExtensions: { CheckAppId: { value: 0 } },
})
console.log({ estimatedFees })

transfer
  .signSubmitAndWatch(papiTestSigner, {
    customSignedExtensions: { CheckAppId: { value: 0 } },
  })
  .subscribe({
    next: (e) => {
      console.log(e.type)
      if (e.type === "finalized") {
        console.log("The tx is now in a finalized block, check it out:")
        console.log(
          `https://explorer.avail.so/?rpc=wss%3A%2F%2Fturing-rpc.avail.so%2Fws#/explorer/query/${e.block.hash}`,
        )
      }
    },
    error: console.error,
    complete() {
      client.destroy()
    },
  })
