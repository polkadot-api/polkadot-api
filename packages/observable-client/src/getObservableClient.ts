import type {
  SubstrateClient,
  UnsubscribeFn,
} from "@polkadot-api/substrate-client"
import { Observable } from "rxjs"
import { ChainHead$, getChainHead$ } from "./chainHead"
import getBroadcastTx$ from "./tx"

export interface ObservableClient {
  chainHead$: () => ChainHead$
  broadcastTx$: (transaction: string) => Observable<never>
  destroy: UnsubscribeFn
}

const clientCache = new Map<
  SubstrateClient,
  { client: ObservableClient; refCount: number }
>()

export const getObservableClient = (
  substrateClient: SubstrateClient,
): ObservableClient => {
  const cached = clientCache.get(substrateClient)
  if (cached) {
    cached.refCount++
    return cached.client
  }

  const destroy = () => {
    const cached = clientCache.get(substrateClient)
    if (!cached || cached.refCount <= 1) {
      clientCache.delete(substrateClient)
      substrateClient.destroy()
    } else {
      cached.refCount--
    }
  }
  const client: ObservableClient = {
    chainHead$: () => getChainHead$(substrateClient.chainHead),
    broadcastTx$: getBroadcastTx$(substrateClient.transaction),
    destroy,
  }

  clientCache.set(substrateClient, { client, refCount: 1 })
  return client
}
