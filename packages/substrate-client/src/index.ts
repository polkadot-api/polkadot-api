import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getTransaction } from "./transaction/transaction"
import { getChainHead } from "./chainhead"
import {
  ClientRequest,
  ClientRequestCb,
  createClient as createRawClient,
} from "./client"
import type { ChainHead } from "./chainhead"
import type { Transaction } from "./transaction"
import { UnsubscribeFn } from "./common-types"
import { abortablePromiseFn } from "./internal-utils"
import { ChainSpecData, createGetChainSpec } from "./chainspec"
import { getCompatibilityEnhancer } from "./request-compatibility-enhancer"
import { chainHead, chainSpec, transaction } from "./methods"

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

export const createClient = (provider: JsonRpcProvider): SubstrateClient => {
  const client = createRawClient(provider)

  const request = abortablePromiseFn(
    <T>(
      onSuccess: (value: T) => void,
      onError: (e: any) => void,
      method: string,
      params: any[],
    ) => client.request(method, params, { onSuccess, onError }),
  )

  const rpcMethods: Promise<Set<string>> = request<
    { methods: Array<string> } | Array<string>
  >("rpc_methods", []).then(
    (x) => new Set(Array.isArray(x) ? x : x.methods),
    () => new Set(),
  )

  const compatibilityEnhancer = getCompatibilityEnhancer(
    rpcMethods,
    client.request,
  )

  return {
    chainHead: getChainHead(
      compatibilityEnhancer(chainHead) as ClientRequest<any, any>,
    ),
    transaction: getTransaction(
      compatibilityEnhancer(transaction) as ClientRequest<string, any>,
    ),
    getChainSpecData: createGetChainSpec(
      compatibilityEnhancer(chainSpec) as ClientRequest<any, any>,
    ),
    destroy: () => {
      client.disconnect()
    },
    request,
    _request: client.request,
  }
}
