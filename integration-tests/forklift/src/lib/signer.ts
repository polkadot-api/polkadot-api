import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import { DEV_MINI_SECRET } from "@polkadot-labs/hdkd-helpers"
import { getTxCreator } from "polkadot-api/tx-creator"

export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const derive = sr25519CreateDerive(DEV_MINI_SECRET)

export const getDevSigner = (path = "//Alice") => {
  const keyPair = derive(path)
  return getTxCreator(keyPair.publicKey, "Sr25519", keyPair.sign)
}
