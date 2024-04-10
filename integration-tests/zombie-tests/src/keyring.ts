import type { PolkadotSigner } from "polkadot-api"
import { getPolkadotSigner } from "polkadot-api/signer"
import { fromHex } from "@polkadot-api/utils"
import { Blake2256 } from "@polkadot-api/substrate-bindings"
import Sr25519Account from "@unique-nft/sr25519"
import { ed25519 } from "@noble/curves/ed25519"
import { secp256k1 } from "@noble/curves/secp256k1"

const accounts: Record<
  "alice" | "bob",
  Record<"sr25519" | "ecdsa" | "ed25519", PolkadotSigner>
> = { alice: {}, bob: {} } as any

;[Sr25519Account.fromUri("//Alice"), Sr25519Account.fromUri("//Bob")].forEach(
  (account, idx) => {
    const name = idx === 0 ? "alice" : "bob"
    accounts[name]["sr25519"] = getPolkadotSigner(
      account.publicKey,
      "Sr25519",
      async (input) => account.sign(input),
    )
  },
)

const aliceEd25519PrivKey = fromHex(
  "0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
)
const bobEd25519PrivKey = fromHex(
  "0x3b7b60af2abcd57ba401ab398f84f4ca54bd6b2140d2503fbcf3286535fe3ff1",
)
;[aliceEd25519PrivKey, bobEd25519PrivKey].forEach((privKey, idx) => {
  const name = idx === 0 ? "alice" : "bob"
  accounts[name]["ed25519"] = getPolkadotSigner(
    ed25519.getPublicKey(privKey),
    "Ed25519",
    async (input) => ed25519.sign(input, privKey),
  )
})

const signEcdsa = (value: Uint8Array, priv: Uint8Array) => {
  const signature = secp256k1.sign(Blake2256(value), priv)
  const signedBytes = signature.toCompactRawBytes()

  const result = new Uint8Array(signedBytes.length + 1)
  result.set(signedBytes)
  result[signedBytes.length] = signature.recovery

  return result
}

const aliceSecp256PrivKey = fromHex(
  "0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
)
const bobSecp256PrivKey = fromHex(
  "0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf",
)

;[aliceSecp256PrivKey, bobSecp256PrivKey].forEach((privKey, idx) => {
  const name = idx === 0 ? "alice" : "bob"
  accounts[name]["ecdsa"] = getPolkadotSigner(
    Blake2256(secp256k1.getPublicKey(privKey)),
    "Ecdsa",
    async (input) => signEcdsa(input, privKey),
  )
})

export { accounts }
