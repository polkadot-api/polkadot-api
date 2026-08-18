import { MultiAddress, wnd } from "@polkadot-api/descriptors"
import { getOfflineApi } from "polkadot-api"
import { getDevTxCreator } from "./signer"

const api = await getOfflineApi(wnd)
// let's create Alice transaction creator
const alice = getDevTxCreator()

// create the transaction sending Bob some assets
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
const transfer = api.tx.Balances.transfer_allow_death({
  dest: MultiAddress.Id(BOB),
  value: 12345n,
})

// read some constant values
console.log(api.constants.Staking.HistoryDepth)

// create an extrinsic while being offline
console.log(
  await transfer.create(alice, {
    nonce: 10000, // made up nonce
    mortality: { mortal: false },
    tip: 100000000n,
  }),
)
