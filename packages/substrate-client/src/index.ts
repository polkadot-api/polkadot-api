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
import { abortablePromiseFn, noop } from "./internal-utils"

export type * from "./common-types"
export type * from "./client"
export type * from "./transaction"
export type * from "./chainhead"

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

  let rpcMethods: Promise<Set<string>> | Set<string> = request<
    { methods: Array<string> } | Array<string>
  >("rpc_methods", []).then(
    (x) => (rpcMethods = new Set(Array.isArray(x) ? x : x.methods)),
  )
  rpcMethods.catch(noop)

  return {
    chainHead: getChainHead(client.request as ClientRequest<any, any>),
    transaction: getTransaction(
      client.request as ClientRequest<string, any>,
      rpcMethods,
    ),
    destroy: () => {
      client.disconnect()
    },
    request,
    _request: client.request,
  }
}
