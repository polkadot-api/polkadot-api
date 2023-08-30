export interface Subscriber<T> {
  next: (data: T) => void
  error: (e: Error) => void
}

export const getSubscriptionsManager = () => {
  const subscriptions = new Map<string, Subscriber<any>>()

  return {
    has: subscriptions.has.bind(subscriptions),
    subscribe(id: string, subscriber: Subscriber<any>) {
      subscriptions.set(id, subscriber)
    },
    unsubscribe(id: string) {
      subscriptions.delete(id)
    },
    next(id: string, data: any) {
      subscriptions.get(id)?.next(data)
    },
    error(id: string, e: Error) {
      const subscriber = subscriptions.get(id)
      if (subscriber) {
        subscriptions.delete(id)
        subscriber.error(e)
      }
    },
    errorAll(e: Error) {
      const subscribers = [...subscriptions.values()]
      subscriptions.clear()
      subscribers.forEach((s) => {
        s.error(e)
      })
    },
  }
}

export type SubscriptionManager = ReturnType<typeof getSubscriptionsManager>
