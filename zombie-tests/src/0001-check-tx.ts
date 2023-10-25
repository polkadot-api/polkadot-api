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
import { secp256k1 } from "@noble/curves/secp256k1"
import { Sr25519Account } from "@unique-nft/sr25519"

/**
 * Public and Private keys were pulled from subkey:
 * substrate key inspect --scheme sr25519 //Alice
 * substrate key inspect --scheme ed25519 //Alice
 * substrate key inspect --scheme ecdsa //Alice
 *
 * substrate key inspect --scheme sr25519 //Bob
 * substrate key inspect --scheme ed25519 //Bob
 * substrate key inspect --scheme ecdsa //Bob
 */

const ALICE_SR25519_PUB_KEY = fromHex(
  "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
)
const ALICE_ED25519_PUB_KEY = fromHex(
  "0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
)
/* const ALICE_ECDSA_PUB_KEY = fromHex(
  "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
) */

const BOB_SR25519_SS58_ADDR =
  "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" as SS58String
const BOB_ED25519_SS58_ADDR =
  "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E" as SS58String
/* const BOB_ECDSA_SS58_ADDR =
  "5DVskgSC9ncWQpxFMeUn45NU43RUq93ByEge6ApbnLk6BR9N" as SS58String */

const TEST_ARGS: [
  signingType: SigningType,
  isMortal: boolean,
  from: Uint8Array,
  to: SS58String,
][] = [
  ["Sr25519", false, ALICE_SR25519_PUB_KEY, BOB_SR25519_SS58_ADDR],
  ["Sr25519", true, ALICE_SR25519_PUB_KEY, BOB_SR25519_SS58_ADDR],
  ["Ed25519", false, ALICE_ED25519_PUB_KEY, BOB_ED25519_SS58_ADDR],
  ["Ed25519", true, ALICE_ED25519_PUB_KEY, BOB_ED25519_SS58_ADDR],
  //  TODO: https://github.com/paritytech/polkadot-api/issues/133
  // ["Ecdsa", false, ALICE_ECDSA_PUB_KEY, BOB_ECDSA_SS58_ADDR],
  // ["Ecdsa", true, ALICE_ECDSA_PUB_KEY, BOB_ECDSA_SS58_ADDR]
]

export async function run(_nodeName: string, networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  const provider = ScProvider(JSON.stringify(customChainSpec))
  const client = createClient(provider)

  await Promise.all(
    TEST_ARGS.map(async ([signingType, isMortal, from, to]) => {
      console.log(
        `Signing Type: ${signingType}, Is Mortal: ${isMortal}, From: ${toHex(
          from,
        )}, To: ${to}`,
      )

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
            case "Ecdsa": {
              const priv = fromHex(
                "0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
              )
              callback({
                userSignedExtensionsData,
                overrides: {},
                signingType: "Ecdsa",
                signer: async (value) =>
                  secp256k1.sign(value, priv).toCompactRawBytes(),
              })
              break
            }
          }
        },
      )

      // Run multiple times to ensure we can create tx with increasing nonce
      for (let i = 0; i < 3; i++) {
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

        const transaction = toHex(
          await createTx(
            from,
            call.enc({
              module: 4,
              method: 0,
              args: {
                dest: {
                  tag: "Id",
                  value: to,
                },
                value: 1000000n,
              },
            }),
          ),
        )

        console.log(
          `${signingType} transaction, isMortal: ${isMortal}, iteration: ${i}`,
          transaction,
        )

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
    }),
  )
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
