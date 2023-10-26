import {
  Callback,
  ConsumerCallback,
  OnCreateTxCtx,
  SigningType,
  UserSignedExtensionName,
  UserSignedExtensions,
  getTxCreator,
} from "@polkadot-api/tx-helper"
import { ScProvider } from "@polkadot-api/sc-provider"
import {
  AccountId,
  Blake2256,
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
import { getObservableClient } from "@polkadot-api/client"
import { tap, lastValueFrom } from "rxjs"

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
const ALICE_ECDSA_PUB_KEY = fromHex(
  "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
)

const BOB_SR25519_SS58_ADDR =
  "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" as SS58String
const BOB_ED25519_SS58_ADDR =
  "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E" as SS58String
const BOB_ECDSA_SS58_ADDR =
  "5DVskgSC9ncWQpxFMeUn45NU43RUq93ByEge6ApbnLk6BR9N" as SS58String

const TEST_ARGS: [
  signingType: SigningType,
  from: Uint8Array,
  to: SS58String,
][] = [
  ["Sr25519", ALICE_SR25519_PUB_KEY, BOB_SR25519_SS58_ADDR],
  ["Ed25519", ALICE_ED25519_PUB_KEY, BOB_ED25519_SS58_ADDR],
  ["Ecdsa", Blake2256(ALICE_ECDSA_PUB_KEY), BOB_ECDSA_SS58_ADDR],
]
type UserCb = <UserSignedExtensionsName extends Array<UserSignedExtensionName>>(
  context: OnCreateTxCtx<UserSignedExtensionsName>,
  callback: Callback<null | ConsumerCallback<UserSignedExtensionsName>>,
) => void

const getSigner = (
  signingType: SigningType,
): ((value: Uint8Array) => Promise<Uint8Array>) => {
  switch (signingType) {
    case "Sr25519": {
      const alice = Sr25519Account.fromUri("//Alice")
      return async (value) => alice.sign(value)
    }

    case "Ed25519": {
      const priv = fromHex(
        "0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
      )
      return async (value) => ed25519.sign(value, priv)
    }

    case "Ecdsa": {
      const priv = fromHex(
        "0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
      )
      return async (value) => {
        const signature = secp256k1.sign(Blake2256(value), priv)
        const signedBytes = signature.toCompactRawBytes()

        const result = new Uint8Array(signedBytes.length + 1)
        result.set(signedBytes)
        result[signedBytes.length] = signature.recovery

        return result
      }
    }
  }
}

const getCreatTxCb =
  (isMortal: boolean, signingType: SigningType): UserCb =>
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

    callback({
      overrides: {},
      userSignedExtensionsData,
      signingType,
      signer: getSigner(signingType),
    })
  }

export async function run(_nodeName: string, networkInfo: any) {
  try {
    const customChainSpec = require(networkInfo.chainSpecPath)
    const provider = ScProvider(JSON.stringify(customChainSpec))
    const client = getObservableClient(createClient(provider))

    const getPromises = (isMortal: boolean) =>
      TEST_ARGS.map(async ([signingType, from, to]) => {
        console.log(
          `Signing Type: ${signingType}, Is Mortal: ${isMortal}, From: ${toHex(
            from,
          )}, To: ${to}`,
        )

        const { createTx } = getTxCreator(
          provider,
          getCreatTxCb(isMortal, signingType),
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
          `Signing Type: ${signingType}, Is Mortal: ${isMortal}, Transaction`,
          transaction,
        )

        const tx$ = client.tx$(transaction).pipe(
          tap({
            next: (e) => {
              console.log(
                `Signing Type: ${signingType}, Is Mortal: ${isMortal}, event:`,
                e,
              )
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
              console.error(
                `Signing Type: ${signingType}, Is Mortal: ${isMortal}, ERROR:`,
                e,
              )
              process.exit(1)
            },
          }),
        )
        await lastValueFrom(tx$)
      })

    await Promise.all(getPromises(true))
    await Promise.all(getPromises(false))
  } catch (err) {
    console.log(err)
    console.log((err as any).stack)
    throw err
  }
}
