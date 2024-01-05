import { getChain } from "@polkadot-api/node-polkadot-provider"
import { getScProvider } from "@polkadot-api/sc-provider"
import {
  AccountId,
  Enum,
  SS58String,
  Struct,
  compact,
  u8,
} from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { lastValueFrom, tap } from "rxjs"
import { createClient } from "@polkadot-api/substrate-client"
import { getObservableClient } from "@polkadot-api/client"
import { Keyring } from "@polkadot-api/node-polkadot-provider"
import { Blake2256 } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"
import { Sr25519Account } from "@unique-nft/sr25519"
import { ed25519 } from "@noble/curves/ed25519"
import { secp256k1 } from "@noble/curves/secp256k1"
import { u16, u32, u64 } from "@polkadot-api/substrate-bindings"
import { firstValueFrom, map } from "rxjs"

/// keypairs start

const Sr25519Keyring = (): Keyring => {
  const keyring = [
    [Sr25519Account.fromUri("//Alice"), "alice"],
    [Sr25519Account.fromUri("//Bob"), "bob"],
  ] as const

  return {
    getPairs() {
      return keyring.map(([kp, name]) => ({
        address: kp.address,
        publicKey: kp.publicKey,
        signingType: "Sr25519",
        sign: async (input) => kp.sign(input),
        name: name,
      }))
    },
    onKeyPairsChanged() {
      return () => {}
    },
  }
}

const Ed25519Keyring = (): Keyring => {
  const alicePrivKey = fromHex(
    "0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
  )
  const bobPrivKey = fromHex(
    "0x3b7b60af2abcd57ba401ab398f84f4ca54bd6b2140d2503fbcf3286535fe3ff1",
  )

  return {
    getPairs() {
      return [
        {
          address: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
          publicKey: ed25519.getPublicKey(alicePrivKey),
          signingType: "Ed25519",
          sign: async (input) => ed25519.sign(input, alicePrivKey),
          name: "alice",
        },
        {
          address: "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
          publicKey: ed25519.getPublicKey(bobPrivKey),
          signingType: "Ed25519",
          sign: async (input) => ed25519.sign(input, bobPrivKey),
          name: "bob",
        },
      ]
    },
    onKeyPairsChanged() {
      return () => {}
    },
  }
}

const EcdsaKeyring = (): Keyring => {
  const alicePrivKey = fromHex(
    "0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
  )
  const bobPrivKey = fromHex(
    "0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf",
  )

  const signEcdsa = (value: Uint8Array, priv: Uint8Array) => {
    const signature = secp256k1.sign(Blake2256(value), priv)
    const signedBytes = signature.toCompactRawBytes()

    const result = new Uint8Array(signedBytes.length + 1)
    result.set(signedBytes)
    result[signedBytes.length] = signature.recovery

    return result
  }

  return {
    getPairs() {
      return [
        {
          address: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
          publicKey: Blake2256(secp256k1.getPublicKey(alicePrivKey)),
          signingType: "Ecdsa",
          sign: async (input) => signEcdsa(input, alicePrivKey),
          name: "alice",
        },
        {
          address: "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
          publicKey: Blake2256(secp256k1.getPublicKey(bobPrivKey)),
          signingType: "Ecdsa",
          sign: async (input) => signEcdsa(input, bobPrivKey),
          name: "bob",
        },
      ]
    },
    onKeyPairsChanged() {
      return () => {}
    },
  }
}

/// keypairs end

//// utils start

const getNonce =
  (client: ReturnType<typeof getObservableClient>) =>
  async (from: Uint8Array) => {
    const lenToDecoder = {
      2: u16.dec,
      4: u32.dec,
      8: u64.dec,
    }

    const chainHead = client.chainHead$()
    const at = await firstValueFrom(chainHead.finalized$)
    return firstValueFrom(
      chainHead
        .call$(at, "AccountNonceApi_account_nonce", toHex(from.subarray(0, 32)))
        .pipe(
          map((result) => {
            const bytes = fromHex(result)
            const decoder = lenToDecoder[bytes.length as 2 | 4 | 8]
            if (!decoder)
              throw new Error(
                "AccountNonceApi_account_nonce retrieved wrong data",
              )

            return decoder(bytes)
          }),
        ),
    )
  }

//// utils end

/// test start

const TEST_ARGS = [Sr25519Keyring(), Ed25519Keyring(), EcdsaKeyring()]

const scProvider = getScProvider()
export async function run(_nodeName: string, networkInfo: any) {
  try {
    const getPromises = (isMortal: boolean) =>
      TEST_ARGS.map(async (keyring) => {
        const customChainSpec = require(networkInfo.chainSpecPath)
        const provider = scProvider(JSON.stringify(customChainSpec)).relayChain
        const client = getObservableClient(createClient(provider))

        const chain = await getChain({
          provider,
          keyring,
          txCustomizations: async (ctx) => {
            const nonce = BigInt(await getNonce(client)(ctx.from))

            return {
              userSignedExtensionsData: {
                CheckMortality: isMortal
                  ? {
                      mortal: true,
                      period: 128,
                    }
                  : {
                      mortal: false,
                    },
                ChargeTransactionPayment: nonce % 2n === 0n ? 10n : 0n,
              },
            } as any
          },
        })

        const accounts = await chain.getAccounts()

        const alice = accounts.find((acct) => acct.displayName === "alice")!
        const bob = accounts.find((acct) => acct.displayName === "bob")!
        const signingType = keyring.getPairs().find((kp) => kp.name === "alice")
          ?.signingType!

        console.log(
          `Signing Type: ${signingType}, Is Mortal: ${isMortal}, From: ${alice.address}, To: ${bob.address}}`,
        )

        const { createTx } = chain.connect(console.log)

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

        const from = alice.publicKey
        const to = bob.address as SS58String

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
          `Signing Type: ${signingType}, Is Mortal: ${isMortal}, From: ${alice.address}, To: ${bob.address}}, Transaction`,
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

        client.chainHead$().unfollow()
        client.destroy()
      })

    await Promise.all(getPromises(true))
    await Promise.all(getPromises(false))
  } catch (err) {
    console.log(err)
    console.log((err as any).stack)
    throw err
  }
}

/// test end
