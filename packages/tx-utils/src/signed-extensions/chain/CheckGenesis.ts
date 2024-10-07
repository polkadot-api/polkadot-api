import { HexString } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"
import type { SignedExtension } from "../internal-types"
import { empty, signedExtension } from "../utils"

export const CheckGenesis = (genesisHash: HexString): SignedExtension =>
  signedExtension(empty, fromHex(genesisHash))
