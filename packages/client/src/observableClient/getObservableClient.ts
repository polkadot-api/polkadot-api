import type { SubstrateClient } from "@polkadot-api/substrate-client"
import getChainHead$ from "./chainHead/chainHead"
import getTx$ from "./tx"

export const getObservableClient = ({
  chainHead,
  transaction,
  destroy,
}: SubstrateClient) => ({
  chainHead$: getChainHead$(chainHead),
  tx$: getTx$(transaction),
  destroy,
})
