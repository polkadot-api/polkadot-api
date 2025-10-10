import {
  isResponse,
  type JsonRpcConnection,
  type JsonRpcId,
  type JsonRpcMessage,
  type JsonRpcProvider,
} from "@polkadot-api/json-rpc-provider"
import { RpcError } from "./RpcError"
import { getSubscriptionsManager, Subscriber } from "./subscriptions-manager"
import { DestroyedError } from "./DestroyedError"

type UnsubscribeFn = () => void
export type FollowSubscriptionCb<T> = (
  subscriptionId: string,
  cb: Subscriber<T>,
) => UnsubscribeFn

export type ClientRequestCb<T, TT> = {
  onSuccess: (result: T, followSubscription: FollowSubscriptionCb<TT>) => void
  onError: (e: Error) => void
}

export type ClientRequest<T, TT> = (
  method: string,
  params: Array<any>,
  cb?: ClientRequestCb<T, TT>,
) => UnsubscribeFn

export interface Client {
  disconnect: () => void
  request: ClientRequest<any, any>
}

let nextClientId = 1
export const createClient = (gProvider: JsonRpcProvider): Client => {
  let clientId = nextClientId++
  const responses = new Map<JsonRpcId, ClientRequestCb<any, any>>()
  const subscriptions = getSubscriptionsManager()

  let connection: JsonRpcConnection | null = null
  const send = (
    id: string,
    method: string,
    params: Array<boolean | string | number | null>,
  ) => {
    connection!.send({
      jsonrpc: "2.0",
      id,
      method,
      params,
    })
  }

  function onMessage(parsed: JsonRpcMessage): void {
    if (isResponse(parsed)) {
      const { id } = parsed
      const cb = responses.get(id)
      if (!cb) return

      responses.delete(id)

      return "error" in parsed
        ? cb.onError(new RpcError(parsed.error))
        : cb.onSuccess(parsed.result, (opaqueId, subscriber) => {
            const subscriptionId = opaqueId
            subscriptions.subscribe(subscriptionId, subscriber)
            return () => {
              subscriptions.unsubscribe(subscriptionId)
            }
          })
    }

    if (parsed.id === undefined) {
      // at this point, it means that it should be a notification
      const { params } = parsed
      const { subscription: subscriptionId, result, error } = params
      if (subscriptionId && ("result" in params || error)) {
        if (error) subscriptions.error(subscriptionId, new RpcError(error!))
        else subscriptions.next(subscriptionId, result)
      }
    } else
      console.warn("Error parsing incomming message: " + JSON.stringify(parsed))
  }

  connection = gProvider(onMessage)

  const disconnect = () => {
    connection?.disconnect()
    connection = null
    subscriptions.errorAll(new DestroyedError())
    responses.forEach((r) => r.onError(new DestroyedError()))
    responses.clear()
  }

  let nextId = 1
  const request = <T, TT>(
    method: string,
    params: Array<any>,
    cb?: ClientRequestCb<T, TT>,
  ): UnsubscribeFn => {
    if (!connection) throw new Error("Not connected")
    const id = `${clientId}-${nextId++}`

    if (cb) responses.set(id, cb)
    send(id, method, params)

    return (): void => {
      responses.delete(id)
    }
  }

  return {
    request,
    disconnect,
  }
}
