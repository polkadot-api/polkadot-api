import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getTxCreator } from "polkadot-api/signer"

const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)

export const getDevSigner = (path = "//Alice") => {
  const keyPair = derive(path)
  return getTxCreator(keyPair.publicKey, "Sr25519", keyPair.sign)
}

export const getDevTxCreator = (path = "//Alice") => {
  const keyPair = derive(path)
  return getTxCreator(keyPair.publicKey, "Sr25519", keyPair.sign)
}
