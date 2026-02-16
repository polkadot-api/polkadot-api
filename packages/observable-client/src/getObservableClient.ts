import {
  type SubstrateClient,
  type UnsubscribeFn,
} from "@polkadot-api/substrate-client"
import { noop, Observable, of } from "rxjs"
import { ChainHead$, getChainHead$, RuntimeContext } from "./chainHead"
import getBroadcastTx$ from "./tx"
import { Archive$, getArchive } from "./archive"

const ofNullFn = () => of(null)

export interface ObservableClient {
  chainHead$: () => ChainHead$
  archive: (
    getRuntime: (codeHash: string) => Observable<RuntimeContext | null>,
  ) => Archive$
  broadcastTx$: (transaction: Uint8Array) => Observable<never>
  destroy: UnsubscribeFn
}

export const getObservableClient = (
  substrateClient: SubstrateClient,
  {
    getMetadata,
    setMetadata,
  }: Partial<{
    getMetadata: (codeHash: string) => Observable<Uint8Array | null>
    setMetadata: (codeHash: string, rawMetadata: Uint8Array) => void
  }> = {},
): ObservableClient => ({
  chainHead$: () =>
    getChainHead$(
      substrateClient.chainHead,
      getMetadata || ofNullFn,
      setMetadata || noop,
    ),
  archive: getArchive(substrateClient.archive),
  broadcastTx$: getBroadcastTx$(substrateClient.transaction),
  destroy: substrateClient.destroy,
})
