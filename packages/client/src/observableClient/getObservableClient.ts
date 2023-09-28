import type { SubstrateClient } from "@polkadot-api/substrate-client"
import getChainHead$ from "./chainHead/chainHead"
import getTx$ from "./tx"

export const getObservableClient = (base: SubstrateClient) => ({
  chainHead$: getChainHead$(base.chainHead),
  tx$: getTx$(base.transaction),
})
