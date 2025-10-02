import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { AccountId } from "polkadot-api"
import { getPolkadotSigner } from "polkadot-api/signer"

const entropy = mnemonicToEntropy(DEV_PHRASE)
const derive = sr25519CreateDerive(entropyToMiniSecret(entropy))
const keyPair = derive("//Alice")
const address = AccountId().dec(keyPair.publicKey)

export const alice = {
  ...getPolkadotSigner(keyPair.publicKey, "Sr25519", keyPair.sign),
  address,
}
