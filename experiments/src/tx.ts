import { UserSignedExtensions, getTxCreator } from "@polkadot-api/tx-helper"
import {
  AccountId,
  Variant,
  Struct,
  compact,
  u8,
  Enum,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import { ed25519 } from "@noble/curves/ed25519"
import { createClient } from "@polkadot-api/substrate-client"
import { getObservableClient } from "@polkadot-api/client"
import { lastValueFrom, tap } from "rxjs"
import { start } from "smoldot"
import { getSmProvider } from "@polkadot-api/sm-provider"
import { westend2 } from "@substrate/connect-known-chains"

const smoldot = start()

const getConnectProvider = () => getSmProvider(smoldot, westend2)
const client = getObservableClient(createClient(getConnectProvider()))

const priv = fromHex(
  "0xb18290bac66576e4067e0c47eb23b2eb40dc2a5906fe9af94063dc163367a1f0",
)
const from = ed25519.getPublicKey(priv)

const txCreator = getTxCreator(
  getConnectProvider(),
  async ({ userSingedExtensionsName }) => {
    const userSignedExtensionsData = Object.fromEntries(
      userSingedExtensionsName.map((x) => {
        if (x === "CheckMortality") {
          const result: UserSignedExtensions["CheckMortality"] = {
            mortal: false,
            // period: 128,
          }
          return [x, result]
        }

        if (x === "ChargeTransactionPayment") return [x, 0n]
        return [x, { tip: 0n }]
      }),
    )

    return {
      userSignedExtensionsData,
      overrides: {},
      signingType: "Ed25519",
      signer: async (value) => ed25519.sign(value, priv),
    }
  },
)

const call = Struct({
  module: u8,
  method: u8,
  args: Struct({
    dest: Variant({
      Id: AccountId(42),
    }),
    value: compact,
  }),
})

const transaction = toHex(
  await txCreator.createTx(
    from,
    call.enc({
      module: 4,
      method: 0,
      args: {
        dest: Enum("Id", "5DyTf5gsCQG3ycM1venTzjoEPMUhKtoU9e9zg1MvnJddbye8"),
        value: 1000000n,
      },
    }),
  ),
)
txCreator.destroy()

const tx$ = client.tx$(transaction).pipe(
  tap({
    next: (e) => {
      console.log(`event:`, e)
      switch (e.type) {
        case "finalized":
          break
        case "invalid":
          process.exit(1)
        default:
          break
      }
    },
    error: (e) => {
      console.error(`ERROR:`, e)
      process.exit(1)
    },
  }),
)
await lastValueFrom(tx$)

client.destroy()
smoldot.terminate()
