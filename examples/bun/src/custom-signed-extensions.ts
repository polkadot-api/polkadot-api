import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getPolkadotSigner } from "polkadot-api/signer"
import { createClient, Enum, FixedSizeBinary } from "polkadot-api"
import { MultiAddress, Pop, turing } from "@polkadot-api/descriptors"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"

const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)
const papiTest = derive("//Alice")
const papiTestSigner = getPolkadotSigner(
  papiTest.publicKey,
  "Sr25519",
  papiTest.sign,
)

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://pop-testnet.parity-lab.parity.io:443/9910"),
  ),
)

const api = client.getTypedApi(Pop)

const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
const transfer = api.tx.ProofOfInk.apply_with_invitation({
  inviter: BOB,
  ticket: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
  signature: {
    type: "Sr25519",
    value: FixedSizeBinary.fromBytes(new Uint8Array(64)),
  },
})

transfer
  .signSubmitAndWatch(papiTestSigner, {
    customSignedExtensions: {
      VerifyMultiSignature: {
        value: Enum("Disabled"),
      },
      RestrictOrigins: {
        value: false,
      },
      AsProofOfInkParticipant: {
        value: Enum("AsInvited", 0),
      },
    },
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
