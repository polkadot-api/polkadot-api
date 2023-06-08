import type { BaseClient } from "../BaseClientInterface"
import { GetProvider, Provider, ProviderStatus, RpcError } from "../types"
import { ErrorRpc } from "./ErrorRpc"
import { OrfanMessages } from "../utils/OrfanMessages"

export interface RawClient extends BaseClient {
  request: <T>(
    method: string,
    params: string,
    cb: (result: T) => void,
    unsubscribeMethod?: string,
  ) => () => void
}

export const createRawClient = (gProvider: GetProvider): RawClient => {
  let nextId = 1
  const callbacks = new Map<number, (cb: any) => void>()

  const subscriptionToId = new Map<string, number>()
  const idToSubscription = new Map<number, string>()

  const orfanMessages = new OrfanMessages()
  const batchedRequests = new Map<
    number,
    [string, string, (m: any) => void, boolean]
  >()

  let provider: Provider | null = null
  let state: ProviderStatus = ProviderStatus.disconnected

  function onMessage(message: string): void {
    try {
      let id,
        result,
        error: RpcError | undefined,
        params: { subscription: any; result: any; error?: RpcError },
        subscription
      ;({ id, result, error, params } = JSON.parse(message))

      // TODO: if the id is `null` it means that its a server notification,
      // perhaps we should handle them... somehow?
      /* istanbul ignore next */
      if (id === null) return

      if (id)
        return callbacks.get(id)?.(
          result === undefined ? new ErrorRpc(error!) : result,
        )

        // at this point, it means that it should be a subscription
      ;({ subscription, result, error } = params)
      if (!subscription || (!result && !error)) throw 0
      const data = result ?? new ErrorRpc(error!)

      id = subscriptionToId.get(subscription)
      if (id) return callbacks.get(id)!(data)

      orfanMessages.set(subscription, data)
    } catch (e) {
      throw new Error("Error parsing incomming message: " + message)
    }
  }

  function onStatusChange(e: ProviderStatus) {
    if (e === ProviderStatus.ready) {
      batchedRequests.forEach((args, id) => {
        process(id, ...args)
      })
      batchedRequests.clear()
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
    callbacks.clear()
    subscriptionToId.clear()
    idToSubscription.clear()
    orfanMessages.clear()
    batchedRequests.clear()
  }

  const process = (
    id: number,
    method: string,
    params: string,
    cb: any,
    isSub: boolean,
  ) => {
    callbacks.set(
      id,
      isSub
        ? (result: string) => {
            subscriptionToId.set(result, id)
            idToSubscription.set(id, result)

            const nextCb = (d: any) => {
              cb(d)
            }

            const orfan = orfanMessages.upsert(result)
            if (orfan) nextCb(orfan)
            callbacks.set(id, nextCb)
          }
        : (message: any) => {
            callbacks.delete(id)
            cb(message)
          },
    )

    const msg = `{"id":${id},"jsonrpc":"2.0","method":"${method}","params":${params}}`
    provider!.send(msg)
  }

  const request = <T>(
    method: string,
    params: string,
    cb: (result: T) => void,
    unsubscribeMethod?: string,
  ): (() => void) => {
    if (!provider) throw new Error("Not connected")
    const id = nextId++

    const isSub = !!unsubscribeMethod
    const cleanup = (): void => {
      if (batchedRequests.has(id)) {
        batchedRequests.delete(id)
        return
      }

      callbacks.delete(id)
      if (!idToSubscription.has(id)) return

      const subId = idToSubscription.get(id)!
      subscriptionToId.delete(subId)
      idToSubscription.delete(id)

      provider!.send(
        JSON.stringify({
          id: nextId++,
          jsonrpc: "2.0",
          method: unsubscribeMethod,
          params: [subId],
        }),
      )
    }

    if (state === ProviderStatus.ready) {
      process(id, method, params, cb, isSub)
    } else {
      batchedRequests.set(id, [method, params, cb as any, isSub])
    }

    return cleanup
  }

  return {
    request,
    connect,
    disconnect,
  }
}
