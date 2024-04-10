import { Observable, Subscription } from "rxjs"

const EMPTY_VALUE = Symbol("EMPTY_VALUE")
type EMPTY_VALUE = typeof EMPTY_VALUE

export const lossLessExhaustMap =
  <I, O>(mapper: (x: I) => Observable<O>) =>
  (source$: Observable<I>): Observable<O> =>
    new Observable((observer) => {
      let innerSubscription: Subscription | null = null
      let queuedValue: I | EMPTY_VALUE = EMPTY_VALUE
      let isOutterDone = false

      const setInnerSubscription = () => {
        const observable = mapper(queuedValue as I)
        queuedValue = EMPTY_VALUE
        innerSubscription = observable.subscribe({
          next(vv) {
            observer.next(vv)
          },
          error(ee) {
            observer.error(ee)
          },
          complete() {
            if (queuedValue !== EMPTY_VALUE) setInnerSubscription()
            else {
              innerSubscription = null
              if (isOutterDone) observer.complete()
            }
          },
        })
      }

      const subscription = source$.subscribe({
        next(v) {
          queuedValue = v
          if (!innerSubscription) setInnerSubscription()
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          if (!innerSubscription) observer.complete()
          isOutterDone = true
        },
      })

      return () => {
        innerSubscription?.unsubscribe()
        subscription.unsubscribe()
      }
    })
