import type {
  SubstrateClient,
  UnsubscribeFn,
} from "@polkadot-api/substrate-client"
import { noop, Observable, of } from "rxjs"
import { ChainHead$, getChainHead$ } from "./chainHead"
import getBroadcastTx$ from "./tx"

const ofNullFn = () => of(null)

export interface ObservableClient {
  chainHead$: (nSubscribers?: number) => ChainHead$
  broadcastTx$: (transaction: string) => Observable<never>
  destroy: UnsubscribeFn
}

const clientCache = new Map<
  SubstrateClient,
  { client: ObservableClient; refCount: number }
>()

export const getObservableClient = (
  substrateClient: SubstrateClient,
  cache: Partial<{
    getMetadata: (codeHash: string) => Observable<Uint8Array | null>
    setMetadata: (codeHash: string, rawMetadata: Uint8Array) => void
  }> = {},
): ObservableClient => {
  const { getMetadata, setMetadata } = cache
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

  let cachedChainhead:
    | readonly [ChainHead$, (nSubscribers: number) => void]
    | null = null
  let currentSubscribers = 0
  let expectedSubscribers: null | number = null

  const client: ObservableClient = {
    chainHead$: (_expectedSubscribers) => {
      currentSubscribers++
      expectedSubscribers ||= _expectedSubscribers || 1
      cachedChainhead ||= getChainHead$(
        substrateClient.chainHead,
        getMetadata || ofNullFn,
        setMetadata || noop,
      )
      const [result, start] = cachedChainhead
      if (expectedSubscribers === currentSubscribers) {
        const copiedCurrentSubscribers = currentSubscribers
        currentSubscribers = 0
        expectedSubscribers = null
        cachedChainhead = null
        start(copiedCurrentSubscribers)
      }
      return result
    },
    broadcastTx$: getBroadcastTx$(substrateClient.transaction),
    destroy,
  }

  clientCache.set(substrateClient, { client, refCount: 1 })
  return client
}
