import {
  JsonRpcConnection,
  JsonRpcProvider,
} from "@polkadot-api/json-rpc-provider"
import { UnsubscribeFn } from "../common-types"
import { RpcError, IRpcError } from "./RpcError"
import {
  OrphanMessages,
  getSubscriptionsManager,
  Subscriber,
} from "@/internal-utils"
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

export const createClient = (gProvider: JsonRpcProvider): Client => {
  const responses = new Map<number, ClientRequestCb<any, any>>()
  const subscriptions = getSubscriptionsManager()
  const orphans = new OrphanMessages<string>()

  let connection: JsonRpcConnection | null = null

  const send = (
    id: number,
    method: string,
    params: Array<boolean | string | number | null>,
  ) => {
    connection!.send(
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
      let id: number,
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
              const pending = orphans.retrieve(subscriptionId)
              if (pending.length) {
                Promise.resolve().then(() => {
                  pending.forEach((msg) => {
                    subscriptions.next(subscriptionId, msg)
                  })
                })
              }
              return () => {
                subscriptions.unsubscribe(subscriptionId)
              }
            })
      }

      // at this point, it means that it should be a notification
      ;({ subscription, result, error } = params)
      if (!subscription || (!error && !Object.hasOwn(params, "result"))) throw 0

      const subscriptionId = parsed.method + subscription
      if (!subscriptions.has(subscriptionId)) {
        orphans.set(subscriptionId, message)
      }

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
  connection = gProvider(onMessage)

  const disconnect = () => {
    connection?.disconnect()
    connection = null
    subscriptions.errorAll(new DestroyedError())
    responses.forEach((r) => r.onError(new DestroyedError()))
    responses.clear()
    orphans.clear()
  }

  let nextId = 1
  const request = <T, TT>(
    method: string,
    params: Array<any>,
    cb?: ClientRequestCb<T, TT>,
  ): UnsubscribeFn => {
    if (!connection) throw new Error("Not connected")
    const id = nextId++

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
