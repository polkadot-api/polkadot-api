import { mnemonicToSeedSync } from "@scure/bip39"
import { HDKey } from "@scure/bip32"
import { getPolkadotSigner, type PolkadotSigner } from "polkadot-api/signer"
import { Binary, createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"
import { myth } from "@polkadot-api/descriptors"
import { secp256k1 } from "@noble/curves/secp256k1.js"
import { keccak_256 } from "@noble/hashes/sha3.js"

function getEvmPolkadotSigner(mnemonic: string): PolkadotSigner {
  const seed = mnemonicToSeedSync(mnemonic, "")
  const keyPair = HDKey.fromMasterSeed(seed).derive("m/44'/60'/0'/0/0")
  const publicAddress = keccak_256(
    secp256k1.getPublicKey(keyPair.privateKey!, false).slice(1),
  ).slice(-20)

  const sign = (data: Uint8Array) => {
    const signature = secp256k1.sign(keccak_256(data), keyPair.privateKey!, {
      prehash: false,
      format: "recovered",
    })
    return Uint8Array.from([...signature.slice(1), signature[0]])
  }

  return getPolkadotSigner(publicAddress, "Ecdsa", sign)
}

const yourSeedPhrase = ""
const signer = getEvmPolkadotSigner(yourSeedPhrase)

const client = createClient(getWsProvider("wss://moonbase-rpc.dwellir.com"))
const api = client.getTypedApi(myth)

const tx = api.tx.System.remark({
  remark: Binary.fromText(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas laoreet velit eu sollicitudin scelerisque. Quisque non bibendum odio. Donec vehicula tortor eget ornare tincidunt. Nulla hendrerit, risus tempor accumsan placerat, dui justo vestibulum augue, ut euismod nibh sem ut arcu viverra fusce.",
  ),
})

console.log(await tx.getEstimatedFees(signer.publicKey))
tx.signSubmitAndWatch(signer).subscribe(console.log, console.error)
