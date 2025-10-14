import { TypedApi, createClient } from "polkadot-api"
import { wnd } from "@polkadot-api/descriptors"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const smoldotRelayChain = import("polkadot-api/chains/westend2").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

const provider = getSmProvider(() => smoldotRelayChain)
export const relayChain = createClient(provider)

export const relayChainApi = relayChain.getTypedApi(wnd)
export type RelayChainApi = TypedApi<typeof wnd>
