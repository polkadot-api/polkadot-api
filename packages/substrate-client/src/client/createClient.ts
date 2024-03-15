import {
  type ConnectProvider,
  type Provider,
} from "@polkadot-api/json-rpc-provider"
import { UnsubscribeFn } from "../common-types"
import { RpcError, IRpcError } from "./RpcError"
import { getSubscriptionsManager, Subscriber } from "@/internal-utils"
import { DestroyedError } from "./DestroyedError"

export type FollowSubscriptionCb<T> = (
  methodName: string,
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
export const createClient = (gProvider: ConnectProvider): Client => {
  let clientId = nextClientId++
  const responses = new Map<string, ClientRequestCb<any, any>>()
  const subscriptions = getSubscriptionsManager()

  let provider: Provider | null = null

  const send = (
    id: string,
    method: string,
    params: Array<boolean | string | number | null>,
  ) => {
    provider!.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params,
      }),
    )
  }

  function onMessage(message: string): void {
    try {
      let id: string,
        result,
        error: IRpcError | undefined,
        params: { subscription: any; result: any; error?: IRpcError },
        subscription: string

      const parsed = JSON.parse(message)
      ;({ id, result, error, params } = parsed)

      if (id) {
        const cb = responses.get(id)
        if (!cb) return

        responses.delete(id)

        return error
          ? cb.onError(new RpcError(error))
          : cb.onSuccess(result, (methodName, opaqueId, subscriber) => {
              const subscriptionId = methodName + opaqueId
              subscriptions.subscribe(subscriptionId, subscriber)
              return () => {
                subscriptions.unsubscribe(subscriptionId)
              }
            })
      }

      // at this point, it means that it should be a notification
      ;({ subscription, result, error } = params)
      if (!subscription || (!error && !Object.hasOwn(params, "result"))) throw 0

      const subscriptionId = parsed.method + subscription

      if (error) {
        subscriptions.error(subscriptionId, new RpcError(error!))
      } else {
        subscriptions.next(subscriptionId, result)
      }
    } catch (e) {
      console.warn("Error parsing incomming message: " + message)
      console.error(e)
    }
  }
  provider = gProvider(onMessage)

  const disconnect = () => {
    provider?.disconnect()
    provider = null
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
    if (!provider) throw new Error("Not connected")
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
