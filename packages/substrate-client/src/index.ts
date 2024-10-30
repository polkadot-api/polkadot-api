import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getTransaction } from "./transaction/transaction"
import { getChainHead } from "./chainhead"
import { ClientRequestCb, createClient as createRawClient } from "./client"
import type { ChainHead } from "./chainhead"
import type { Transaction } from "./transaction"
import { UnsubscribeFn } from "./common-types"
import { abortablePromiseFn } from "./internal-utils"
import { ChainSpecData, createGetChainSpec } from "./chainspec"

export { AbortError } from "@polkadot-api/utils"
export type * from "@polkadot-api/json-rpc-provider"

export type * from "./common-types"
export type * from "./client"
export type * from "./transaction"
export type * from "./chainhead"
export type * from "./chainspec"

export { RpcError, DestroyedError } from "./client"
export {
  StopError,
  DisjointError,
  OperationError,
  OperationInaccessibleError,
  OperationLimitError,
} from "./chainhead"

export interface SubstrateClient {
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
