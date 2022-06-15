import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { Observable, Subscriber, Subscription } from "rxjs"

export const getSubscribe = (getProvider: () => JsonRpcProvider) => {
  const subscriptions = new Map<string, Set<Subscriber<any>>>()
  let latestMessage: any = null

  const onMessage = (message: any) => {
    latestMessage = message
    const sub: string = message?.data.subscription
    ;(subscriptions.get(sub) ?? []).forEach((x) => x.next(message.data))
  }

  let currentProvider: JsonRpcProvider | null = null
  const killCurrentProvider = () => {
    if (!currentProvider) return
    ;[...subscriptions.values()].forEach((x) =>
      [...x].forEach((o) => {
        try {
          o.complete()
        } catch {}
      }),
    )
    subscriptions.clear()
    currentProvider.removeListener("message", onMessage)
    currentProvider.removeListener("disconnect", killCurrentProvider)
    currentProvider = null
  }

  const requestSubscription = (params: Array<any>): Promise<string> => {
    const provider = getProvider()
    if (currentProvider !== provider) {
      killCurrentProvider()
      currentProvider = provider
      provider.on("message", onMessage)
      provider.on("disconnect", killCurrentProvider)
    }
    return provider.request({ method: "eth_subscribe", params })
  }

  const getSubscription = (subscriptionId: string) =>
    new Observable<any>((observer) => {
      const subscriptors = subscriptions.get(subscriptionId) ?? new Set()
      subscriptors.add(observer)
      subscriptions.set(subscriptionId, subscriptors)

      if (latestMessage?.data.subscription === subscriptionId) {
        observer.next(latestMessage.data)
      }

      return () => {
        subscriptors.delete(observer)
        if (!subscriptors.size) subscriptions.delete(subscriptionId)
      }
    })

  return <T = any>(params: Array<any>): Observable<T> =>
    new Observable((observer) => {
      let subs: Subscription
      requestSubscription(params).then(
        (x) => {
          if (!observer.closed) {
            subs = getSubscription(x).subscribe(observer)
          }
        },
        (e) => observer.error(e),
      )
      return () => {
        subs?.unsubscribe()
      }
    })
}
