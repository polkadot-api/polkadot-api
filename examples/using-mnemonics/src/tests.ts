import { Sr25519Account } from "@unique-nft/sr25519"
import { generateMnemonic } from "bip39"
import { ed25519 } from "@noble/curves/ed25519"
import { secp256k1 } from "@noble/curves/secp256k1"
import sha256 from "sha256"
// TODO: find alternative function.
import { encodeAddress } from "@polkadot/util-crypto"

// Tests pertaining to deriving key pairs and ss58 formatted addresses from mnemonics.
//
// Uses sr25519, ed25519 and ecdsa curves.

export async function run() {
  try {
    // sr25519
    //
    // sr25519 has mnemonic generation built in to its API.

    // generate a 24 character mnemonic (128 bit by default).
    {
      console.log("\n--- sr25519 ---")
      const mnemonic = Sr25519Account.generateMnemonic(256)
      console.log("mnemonic: ", mnemonic)

      // genetate alice account from mnemonic.
      const account = Sr25519Account.fromUri(mnemonic)
      console.log("polkadot address: ", account.prefixedAddress(0))

      // get prefixed address
      const ss58Prefix = 2
      const kusamaAddress = account.prefixedAddress(ss58Prefix)
      console.log("kusama address: ", kusamaAddress)
    }

    // ed25519
    //
    // ed25519 does not have mnemonic generation built in to its API. We can use bip39 to generate a mnemonic and then convert it to a private key.

    // generate a 24 character mnemonic (128 bit by default if no arg provided).
    {
      console.log("\n--- ed25519 ---")
      const mnemonic = generateMnemonic(256)
      console.log("mnemonic: ", mnemonic)

      // convert mnemonic into a 32 bit seed.

      // Note: this generates a 64 byte seed. Not compatible with ed25519.getPublicKey().
      // const seed = mnemonicToSeedSync(mnemonic)

      const seed = sha256(mnemonic)
      console.log("seed: ", seed)

      // generate private key from mnemonic.
      const pubKey = ed25519.getPublicKey(seed)

      // generate a westend address.
      const ss58Prefix = 42
      const address = encodeAddress(pubKey, ss58Prefix)
      console.log("westend address: ", address)
    }

    // ecdsa
    //
    // edcsa does not have mnemonic generation built in to its API. We can use bip39 to generate a mnemonic and then convert it to a private key.
    {
      console.log("\n--- ecdsa ---")
      const mnemonic = generateMnemonic(256)
      console.log("mnemonic: ", mnemonic)

      const seed = sha256(mnemonic)
      console.log("seed: ", seed)

      // generate private key from mnemonic.
      const pubKey = secp256k1.getPublicKey(seed)

      // generate a kusama address.
      const ss58Prefix = 2
      const address = encodeAddress(pubKey, ss58Prefix)
      console.log("kusama address: ", address)
    }

    console.log("\nDone")
  } catch (err) {
    console.log(err)
    throw err
  }
}

run()
