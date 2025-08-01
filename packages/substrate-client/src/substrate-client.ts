import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  ClientRequestCb,
  createClient as createRawClient,
} from "@polkadot-api/raw-client"
import { getTransaction } from "./transaction/transaction"
import { getChainHead } from "./chainhead"
import type { ChainHead } from "./chainhead"
import type { Transaction } from "./transaction"
import { UnsubscribeFn } from "./common-types"
import { abortablePromiseFn } from "./internal-utils"
import { ChainSpecData, createGetChainSpec } from "./chainspec"
import { Archive, getArchive } from "./archive"

export interface SubstrateClient {
  archive: Archive
  chainHead: ChainHead
  transaction: Transaction
  destroy: UnsubscribeFn
  getChainSpecData: () => Promise<ChainSpecData>
  request: <T>(
    method: string,
    params: any[],
    abortSignal?: AbortSignal,
  ) => Promise<T>
  _request: <Reply, Notification>(
    method: string,
    params: any[],
    cb?: ClientRequestCb<Reply, Notification>,
  ) => UnsubscribeFn
}

const clientCache = new Map<
  JsonRpcProvider,
  { client: SubstrateClient; refCount: number }
>()

export const createClient = (provider: JsonRpcProvider): SubstrateClient => {
  const cached = clientCache.get(provider)
  if (cached) {
    cached.refCount++
    return cached.client
  }

  const { request, disconnect } = createRawClient(provider)
  const destroy = () => {
    const cached = clientCache.get(provider)
    if (!cached || cached.refCount <= 1) {
      clientCache.delete(provider)
      disconnect()
    } else {
      cached.refCount--
    }
  }
  const client: SubstrateClient = {
    archive: getArchive(request),
    chainHead: getChainHead(request),
    transaction: getTransaction(request),
    getChainSpecData: createGetChainSpec(request),
    destroy,
    request: abortablePromiseFn(
      <T>(
        onSuccess: (value: T) => void,
        onError: (e: any) => void,
        method: string,
        params: any[],
      ) => request(method, params, { onSuccess, onError }),
    ),
    _request: request,
  }
  clientCache.set(provider, { client, refCount: 1 })
  return client
}
