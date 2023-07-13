import { GetProvider } from "@unstoppablejs/provider"
import { transaction } from "./transaction/transaction"
import { follow } from "./chainhead/follow"
import { ClientRequest, createClient as createRawClient } from "./client"

export * from "./common-types"
export * from "./transaction/types"
export * from "./chainhead/types"

export const createClient = (provider: GetProvider) => {
  const client = createRawClient(provider)
  client.connect()

  return {
    transaction: transaction(client.request as ClientRequest<any, any>),
    chainHead: follow(client.request as ClientRequest<any, any>),
  }
}
