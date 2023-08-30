import { GetProvider } from "@unstoppablejs/provider"
import { getTransaction } from "./transaction/transaction"
import { getChainHead } from "./chainhead"
import {
  ClientRequest,
  ClientRequestCb,
  createClient as createRawClient,
} from "./client"
import type { ChainHead } from "./chainhead"
import type { Transaction } from "./transaction/types"
import { UnsubscribeFn } from "./common-types"

export type * from "./common-types"
export type * from "./client"
export type * from "./transaction"
export type * from "./chainhead"

export { RpcError } from "./client"
export { TransactionError } from "./transaction"
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
  _request: <Reply, Notification>(
    method: string,
    params: any[],
    cb?: ClientRequestCb<Reply, Notification>,
  ) => UnsubscribeFn
}

export const createClient = (provider: GetProvider): SubstrateClient => {
  const client = createRawClient(provider)
  client.connect()

  return {
    chainHead: getChainHead(client.request as ClientRequest<any, any>),
    transaction: getTransaction(client.request as ClientRequest<any, any>),
    _request: client.request,
  }
}
