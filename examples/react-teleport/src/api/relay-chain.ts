import { TypedApi, createClient } from "polkadot-api"
import { wnd } from "@polkadot-api/descriptors"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const smoldotRelayChain = import("polkadot-api/chains/westend2").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

const provider = getSmProvider(smoldotRelayChain)
export const relayChain = createClient(provider)

relayChain.finalized$.subscribe((block) => {
  console.log(`#${block.number} - ${block.parent}`)
})

export const relayChainApi = relayChain.getTypedApi(wnd)

relayChainApi.query.System.Account.getValue("")

export type RelayChainApi = TypedApi<typeof wnd>

const account = await relayChainApi.query.System.Account.getValue(
  "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
)
account.data.frozen
