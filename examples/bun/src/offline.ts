import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getPolkadotSigner } from "polkadot-api/signer"
import { getOfflineApi } from "polkadot-api"
import { MultiAddress, wnd } from "@polkadot-api/descriptors"

// let's create Alice signer
const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)
const aliceKeyPair = derive("//Alice")
const alice = getPolkadotSigner(
  aliceKeyPair.publicKey,
  "Sr25519",
  aliceKeyPair.sign,
)

const api = await getOfflineApi(wnd)

// create the transaction sending Bob some assets
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
const transfer = api.tx.Balances.transfer_allow_death(
  MultiAddress.Id(BOB),
  12345n,
)

// read some constant values
console.log(api.constants.Staking.HistoryDepth)

// create an extrinsic while being offline
console.log(
  await transfer.sign(alice, {
    nonce: 10000, // made up nonce
    mortality: { mortal: false },
    tip: 100000000n,
  }),
)
