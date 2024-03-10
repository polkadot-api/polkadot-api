import { createClient } from "@polkadot-api/client"
import { relayChains } from "./polkadot-provider"
import types from "../codegen/dot-assethub"
import { polkadot_asset_hub } from "@substrate/connect-known-chains"

export const paraChain = createClient(
  (await relayChains.polkadot.getParachain(polkadot_asset_hub)).connect,
)

export const paraChainApi = paraChain.getTypedApi(types)

export const CORETIME_PARACHAIN_ID = 1000
