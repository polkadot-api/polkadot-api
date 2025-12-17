import { TypedApi, createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldotRelayChain } from "./relay-chain"
import { wndAssethub } from "@polkadot-api/descriptors"
import { smoldot } from "./smoldot"

const smoldotParaChain = Promise.all([
  smoldotRelayChain,
  import("polkadot-api/chains/westend_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

const provider = getSmProvider(() => smoldotParaChain)
export const paraChain = createClient(provider)

export const PARACHAIN_ID = 1000
export const paraChainApi = paraChain.getTypedApi(wndAssethub)
export type ParaChainApi = TypedApi<typeof wndAssethub>
