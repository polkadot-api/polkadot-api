import type { SubstrateClient } from "@polkadot-api/substrate-client"
export type * from "./chainHead"

import { getChainHead$ } from "./chainHead"
import getBroadcastTx$ from "./tx"

export const getObservableClient = ({
  chainHead,
  transaction,
  destroy,
}: SubstrateClient) => ({
  chainHead$: () => getChainHead$(chainHead),
  broadcastTx$: getBroadcastTx$(transaction),
  destroy,
})
