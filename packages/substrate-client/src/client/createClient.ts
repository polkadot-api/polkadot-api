import { GetProvider, Provider, ProviderStatus } from "@unstoppablejs/provider"
import type { UnsubscribeFn } from "../common-types"
import { ErrorRpc, RpcError } from "./ErrorRpc"

export type SubscriptionCb<T = unknown> = (data: T, done: () => void) => void
export type FollowSubscriptionCb<T> = (
  cb: SubscriptionCb<T>,
  subscriptionId: string,
  unfollowMethod?: string,
) => void

export type ClientRequestCb<T = unknown, TT = unknown> = (
  result: T,
  followSubscription: FollowSubscriptionCb<TT>,
) => void
export type ClientRequest<T = unknown, TT = unknown> = (
  method: string,
  params: Array<any>,
  cb: ClientRequestCb<T, TT>,
) => UnsubscribeFn

export interface Client {
  connect: () => void
  disconnect: () => void
  request: ClientRequest<any>
}

export const createClient = (gProvider: GetProvider): Client => {
  const responses = new Map<number, ClientRequestCb>()
  const subscriptions = new Map<string, [SubscriptionCb, string | undefined]>()
  const subscriptionToId = new Map<string, number>()
  const idToSubscription = new Map<number, string>()

  const clearSubscription = (subscriptionId: string): string | undefined => {
    const id = subscriptionToId.get(subscriptionId)!
    idToSubscription.delete(id)
    subscriptionToId.delete(subscriptionId)
    const [, result] = subscriptions.get(subscriptionId)!
    subscriptions.delete(subscriptionId)
    return result
  }

  const queuedRequests = new Map<number, Parameters<ClientRequest>>()
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
          (cb, subscriptionId, unfollowMethod) => {
            subscriptionToId.set(subscriptionId, id)
            idToSubscription.set(id, subscriptionId)
            subscriptions.set(subscriptionId, [cb, unfollowMethod])
          },
        )
      }

      // at this point, it means that it should be a notification
      ;({ subscription, result, error } = params)
      if (!subscription || (!result && !error)) throw 0

      const data = result ?? new ErrorRpc(error!)
      if (!subscriptions.has(subscription)) return

      subscriptions.get(subscription)![0](data, () => {
        clearSubscription(subscription)
      })
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
    subscriptions.clear()
    subscriptionToId.clear()
    idToSubscription.clear()
    queuedRequests.clear()
  }

  const process = (id: number, ...args: Parameters<ClientRequest>) => {
    const [method, params, cb] = args
    responses.set(id, cb)
    send(id, method, params)
  }

  let nextId = 1
  const request: ClientRequest = (method, params, cb) => {
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
      if (!idToSubscription.has(id)) return

      const subId = idToSubscription.get(id)!
      const unsubscribeMethod = clearSubscription(subId)
      if (unsubscribeMethod) send(nextId++, unsubscribeMethod, [subId])
    }
  }

  return {
    request,
    connect,
    disconnect,
  }
}
