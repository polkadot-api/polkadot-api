import { roc, MultiAddress } from "@polkadot-api/descriptors"
import { readFileSync } from "fs"
import { createClient, PolkadotClient } from "polkadot-api"
import { logsProvider } from "polkadot-api/logs-provider"
import { getPolkadotSigner } from "polkadot-api/signer"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"

const entropy = mnemonicToEntropy(DEV_PHRASE)
const miniSecret = entropyToMiniSecret(entropy)
const hdkdKeyPair = sr25519CreateDerive(miniSecret)("//Alice")
export const signer = getPolkadotSigner(
  hdkdKeyPair.publicKey,
  "Sr25519",
  (input) => hdkdKeyPair.sign(input),
)

const provider = logsProvider(
  readFileSync("./src/tx-with-competing-forks/logs", {
    encoding: "utf8",
  }).split("\n"),
)

export const client: PolkadotClient = createClient(provider)
;(async () => {
  console.log("let's go")
  const api = client.getTypedApi(roc)

  const tx = await api.tx.Balances.transfer_keep_alive({
    dest: MultiAddress.Id("5Ef6xod2B3ykQXqTDCPozDuGj1jYnzcKDkQ6X16t2VhfpD8k"),
    value: 10n ** BigInt(10),
  }).sign(signer)

  await client.submit(tx)
  client.destroy()
  console.log("success")
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
