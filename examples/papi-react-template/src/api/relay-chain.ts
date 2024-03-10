import { createClient } from "@polkadot-api/client"
import { relayChains } from "./polkadot-provider"
import types from "../codegen/dot"

export const relayChain = createClient(relayChains.polkadot.connect)
export const relayChainApi = relayChain.getTypedApi(types)
