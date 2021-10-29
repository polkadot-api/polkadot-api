import { Client, GetProvider, Provider, ProviderStatus } from "./types"

export const CreateClient = (gProvider: GetProvider): Client => {
  let nextId = 1
  const callbacks = new Map<number, (cb: any) => void>()

  const subscriptionToId = new Map<string, number>()
  const idToSubscription = new Map<number, string>()

  const orfanMessages = new Map<string, { date: number; message: any }>()
  const batchedRequests = new Map<
    number,
    [string, Array<any>, (m: any) => void, boolean]
  >()

  let provider: Provider | null = null
  let state: ProviderStatus = ProviderStatus.disconnected

  function onMessage(message: string): void {
    try {
      let id, result, params: { subscription: any; result: any }, subscription
      ;({ id, result, params } = JSON.parse(message))

      if (id)
        return callbacks.get(id)?.(result)

        // If the ID wasn't present, it must be a subscription
      ;({ subscription, result } = params)
      if (!subscription || !result) throw new Error("Wrong message format")

      id = subscriptionToId.get(subscription)
      if (id) return callbacks.get(id)?.(result)

      orfanMessages.set(subscription, {
        date: Date.now(),
        message: result,
      })
    } catch (e) {
      console.error("Error parsing an incomming message", message)
      console.error(e)
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
    params: Array<any>,
    cb: any,
    isSub: boolean,
  ) => {
    callbacks.set(
      id,
      isSub
        ? (result: string) => {
            subscriptionToId.set(result, id)
            idToSubscription.set(id, result)

            const nextCb = (d: any) => cb(d.changes[0][1])

            const orfan = orfanMessages.get(result)
            if (orfan) {
              orfanMessages.delete(result)
              nextCb(orfan.message)
            }
            callbacks.set(id, nextCb)
          }
        : (message: any) => {
            callbacks.delete(id)
            cb(message)
          },
    )

    provider!.send(
      JSON.stringify({
        id,
        jsonrpc: "2.0",
        method,
        params,
      }),
    )
  }

  const request = <T>(
    method: string,
    params: Array<any>,
    cb: (result: T) => void,
  ): (() => void) => {
    if (!provider) throw new Error("Not connected")
    const id = nextId++

    const isSub = method.indexOf("subscribe") > -1
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

      const [first, second] = method.split("_")

      provider!.send(
        JSON.stringify({
          id: nextId++,
          jsonrpc: "2.0",
          method: `${first}_un${second}`,
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
