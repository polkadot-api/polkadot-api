import { defer, Observable, ObservableInput, Subscription } from "rxjs"

export const concatMapEager =
  <I, O>(
    mapper: (outterValue: I, index: number) => ObservableInput<O>,
    concurrent = Infinity,
  ) =>
  (source$: Observable<I>) =>
    new Observable<O>((observer) => {
      let topSubscription: Subscription
      const queues = new Map<number, Observable<O>>()
      const innerSubscriptions = new Map<number, Subscription>()
      const results = new Map<number, O[]>()

      let mapperIdx = 0
      let subscriptionIdx = 0
      let observerIdx = 0

      const nextSubscription = () => {
        const inner$ = queues.get(subscriptionIdx)
        if (!inner$) {
          if (
            innerSubscriptions.size === 0 &&
            (typeof topSubscription === "undefined" || topSubscription.closed)
          ) {
            observer.complete()
          }
          return
        }
        const idx = subscriptionIdx++
        queues.delete(idx)
        if (observerIdx !== idx) {
          results.set(idx, [])
        }

        let isCompleted = false
        let subscription = inner$.subscribe({
          next(x: O) {
            if (observerIdx === idx) {
              observer.next(x)
            } else {
              results.get(idx)!.push(x)
            }
          },
          complete() {
            isCompleted = true
            innerSubscriptions.delete(idx)
            if (idx === observerIdx) {
              observerIdx++
              while (results.has(observerIdx)) {
                results.get(observerIdx)!.forEach((x) => observer.next(x))
                results.delete(observerIdx)
                if (innerSubscriptions.has(observerIdx)) {
                  break
                }
                observerIdx++
              }
            }
            nextSubscription()
          },
          error(e: any) {
            observer.error(e)
          },
        })

        if (!isCompleted) innerSubscriptions.set(idx, subscription)
      }

      topSubscription = source$.subscribe({
        next(outterValue: I) {
          const idx = mapperIdx++
          queues.set(
            idx,
            defer(() => mapper(outterValue, idx)),
          )
          if (innerSubscriptions.size < concurrent) {
            nextSubscription()
          }
        },
        error(e: any) {
          observer.error(e)
        },
        complete() {
          if (innerSubscriptions.size === 0) {
            observer.complete()
          }
        },
      })

      return () => {
        innerSubscriptions.forEach((subscription) => subscription.unsubscribe())
        topSubscription.unsubscribe()
        queues.clear()
        results.clear()
      }
    })
