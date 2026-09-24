import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"
import { getVerifyMultiSignatureTxCreator } from "polkadot-api/tx-creator"

const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE))
const derive = sr25519CreateDerive(miniSecret)

export const getDevVerifySignatureTxCreator = (path = "//Alice") => {
  const keyPair = derive(path)
  return getVerifyMultiSignatureTxCreator(
    keyPair.publicKey,
    "Sr25519",
    keyPair.sign,
  )
}
