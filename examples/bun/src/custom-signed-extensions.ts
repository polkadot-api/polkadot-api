import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  accountId,
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
  sr25519,
} from "@polkadot-labs/hdkd-helpers"
import { getPolkadotSigner } from "polkadot-api/signer"
import { AccountId, Binary, createClient } from "polkadot-api"
import { hyp, MultiAddress, turing } from "@polkadot-api/descriptors"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { secp256k1 } from "@noble/curves/secp256k1"
import { Blake2256 } from "@polkadot-api/substrate-bindings"
import { fromHex } from "polkadot-api/utils"

const signEcdsa = (value: Uint8Array, priv: Uint8Array) => {
  const signature = secp256k1.sign(Blake2256(value), priv)
  const signedBytes = signature.toCompactRawBytes()

  const result = new Uint8Array(signedBytes.length + 1)
  result.set(signedBytes)
  result[signedBytes.length] = signature.recovery

  return result
}

const privKey = fromHex(
  "0xcb6df9de1f1ca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
)

const address = Blake2256(secp256k1.getPublicKey(privKey))
console.log(AccountId().dec(address))

const papiTestSigner = getPolkadotSigner(address, "Ecdsa", async (input) =>
  signEcdsa(input, privKey),
)

const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("wss://hyperbridge-paseo-rpc.blockops.network"),
  ),
)

const api = client.getTypedApi(hyp)
const tx = await api.txFromCallData(
  Binary.fromHex(
    "0x0400100000190154686973206973206120746573742e2e2e2049206861766520746f20707574206d616e79206d6f726520627974657320696e20686572652c20736f206865726520776520676f0000190154686973206973206120746573742e2e2e2049206861766520746f20707574206d616e79206d6f726520627974657320696e20686572652c20736f206865726520776520676f0000190154686973206973206120746573742e2e2e2049206861766520746f20707574206d616e79206d6f726520627974657320696e20686572652c20736f206865726520776520676f0000190154686973206973206120746573742e2e2e2049206861766520746f20707574206d616e79206d6f726520627974657320696e20686572652c20736f206865726520776520676f",
  ),
)

tx.signSubmitAndWatch(papiTestSigner).subscribe({
  next: (e) => {
    console.log(e.type)
    if (e.type === "finalized") {
      console.log("The tx is now in a finalized block, check it out:")
      console.log(
        `https://explorer.avail.so/?rpc=wss%3A%2F%2Fturing-rpc.avail.so%2Fws#/explorer/query/${e.block.hash}`,
      )
    }
  },
  error: console.error,
  complete() {
    client.destroy()
  },
})
