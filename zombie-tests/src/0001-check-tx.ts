import {
  SigningType,
  UserSignedExtensions,
  getTxCreator,
} from "@polkadot-api/tx-helper"
import { ScProvider } from "@polkadot-api/sc-provider"
import {
  AccountId,
  Enum,
  SS58String,
  Struct,
  compact,
  u8,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import { createClient } from "@polkadot-api/substrate-client"
import { ed25519 } from "@noble/curves/ed25519"
import { Sr25519Account } from "@unique-nft/sr25519"

const TEST_ARGS: [signingType: SigningType, isMortal: boolean][] = [
  ["Sr25519", false],
  ["Sr25519", true],
  ["Ed25519", false],
  ["Ed25519", true],
]

export async function run(_nodeName: string, networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  const provider = ScProvider(JSON.stringify(customChainSpec))
  const client = createClient(provider)

  for (const [signingType, isMortal] of TEST_ARGS) {
    console.log(`Signing Type: ${signingType}, Is Mortal: ${isMortal}`)

    const { createTx } = getTxCreator(
      provider,
      ({ userSingedExtensionsName }, callback) => {
        const userSignedExtensionsData = Object.fromEntries(
          userSingedExtensionsName.map((x) => {
            if (x === "CheckMortality") {
              const result: UserSignedExtensions["CheckMortality"] = isMortal
                ? {
                    mortal: true,
                    period: 128,
                  }
                : {
                    mortal: false,
                  }

              return [x, result]
            }

            if (x === "ChargeTransactionPayment") return [x, 0n]
            return [x, { tip: 0n }]
          }),
        )
        switch (signingType) {
          case "Sr25519": {
            const alice = Sr25519Account.fromUri("//Alice")
            callback({
              userSignedExtensionsData,
              overrides: {},
              signingType: "Sr25519",
              signer: async (value) => alice.sign(value),
            })
            break
          }
          case "Ed25519": {
            const priv = fromHex(
              "0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
            )
            callback({
              userSignedExtensionsData,
              overrides: {},
              signingType: "Ed25519",
              signer: async (value) => ed25519.sign(value, priv),
            })
            break
          }
        }
      },
    )

    const call = Struct({
      module: u8,
      method: u8,
      args: Struct({
        dest: Enum({
          Id: AccountId(42),
        }),
        value: compact,
      }),
    })

    const from =
      signingType === "Sr25519"
        ? fromHex(
            "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
          )
        : fromHex(
            "0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
          )
    const to =
      signingType === "Sr25519"
        ? "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E"
        : "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
    const transaction = toHex(
      await createTx(
        from,
        call.enc({
          module: 4,
          method: 0,
          args: {
            dest: {
              tag: "Id",
              value: to as SS58String,
            },
            value: 1000000n,
          },
        }),
      ),
    )

    console.log("transaction", transaction)

    const done = deferred()
    client.transaction(
      transaction,
      (e) => {
        console.log(e)
        switch (e.type) {
          case "finalized":
            done.resolve()
            break
          case "invalid":
            process.exit(1)
          default:
            break
        }
      },
      (e) => {
        console.error("there was an error ", e)
        process.exit(1)
      },
    )

    await done
  }
}

interface Deferred<T> extends Promise<T> {
  readonly state: "pending" | "fulfilled" | "rejected"
  resolve(value?: T | PromiseLike<T>): void
  reject(reason?: any): void
}

function deferred<T>(): Deferred<T> {
  let methods
  let state = "pending"
  const promise = new Promise<T>((resolve, reject) => {
    methods = {
      async resolve(value: T | PromiseLike<T>) {
        await value
        state = "fulfilled"
        resolve(value)
      },
      reject(reason?: any) {
        state = "rejected"
        reject(reason)
      },
    }
  })
  Object.defineProperty(promise, "state", { get: () => state })
  return Object.assign(promise, methods) as Deferred<T>
}
