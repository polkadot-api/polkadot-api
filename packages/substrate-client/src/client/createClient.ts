import { GetProvider, Provider, ProviderStatus } from "@unstoppablejs/provider"
import type { UnsubscribeFn } from "../common-types"
import { ErrorRpc, RpcError } from "./ErrorRpc"
import {
  getSubscriptionsManager,
  Subscriber,
} from "@/utils/subscriptions-manager"

export type FollowSubscriptionCb<T> = (
  subscriptionId: string,
  cb: Subscriber<T>,
) => UnsubscribeFn

export type ClientRequestCb<T, TT> = (
  result: T,
  followSubscription: FollowSubscriptionCb<TT>,
) => void

export type ClientRequest<T, TT> = (
  method: string,
  params: Array<any>,
  cb?: ClientRequestCb<T, TT>,
) => UnsubscribeFn

export interface Client {
  connect: () => void
  disconnect: () => void
  request: ClientRequest<any, any>
}

export const createClient = (gProvider: GetProvider): Client => {
  const responses = new Map<number, ClientRequestCb<any, any>>()
  const subscriptions = getSubscriptionsManager()

  const queuedRequests = new Map<number, Parameters<ClientRequest<any, any>>>()
  let provider: Provider | null = null
  let state: ProviderStatus = ProviderStatus.disconnected

  const send = (
    id: number,
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
      let id: number,
        result,
        error: RpcError | undefined,
        params: { subscription: any; result: any; error?: RpcError },
        subscription: string
      ;({ id, result, error, params } = JSON.parse(message))

      if (id) {
        const cb = responses.get(id)
        if (!cb) return

        responses.delete(id)
        return cb(
          result === undefined ? new ErrorRpc(error!) : result,
          (subscriptionId, subscriber) => {
            subscriptions.subscribe(subscriptionId, subscriber)
            return () => {
              subscriptions.unsubscribe(subscriptionId)
            }
          },
        )
      }

      // at this point, it means that it should be a notification
      ;({ subscription, result, error } = params)
      if (!subscription || (!result && !error)) throw 0

      const data = result ?? new ErrorRpc(error!)
      subscriptions.next(subscription, data)
    } catch (e) {
      console.log(e)
      throw new Error("Error parsing incomming message: " + message)
    }
  }

  function onStatusChange(e: ProviderStatus) {
    if (e === ProviderStatus.ready) {
      queuedRequests.forEach((args, id) => {
        process(id, ...args)
      })
      queuedRequests.clear()
    }
    state = e
  }

  const connect = () => {
    provider = gProvider(onMessage, onStatusChange)
    provider.open()
  }

  const disconnect = () => {
    provider?.close()
    provider = null
    responses.clear()
    queuedRequests.clear()
    subscriptions.errorAll(new Error("disconnected"))
  }

  const process = (
    id: number,
    ...args: Parameters<ClientRequest<any, any>>
  ) => {
    const [method, params, cb] = args
    if (cb) responses.set(id, cb)
    send(id, method, params)
  }

  let nextId = 1
  const request = <T, TT>(
    method: string,
    params: Array<any>,
    cb?: ClientRequestCb<T, TT>,
  ): UnsubscribeFn => {
    if (!provider) throw new Error("Not connected")
    const id = nextId++

    if (state === ProviderStatus.ready) {
      process(id, method, params, cb)
    } else {
      queuedRequests.set(id, [method, params, cb])
    }

    return (): void => {
      if (queuedRequests.has(id)) {
        queuedRequests.delete(id)
        return
      }

      responses.delete(id)
    }
  }

  return {
    request,
    connect,
    disconnect,
  }
}
