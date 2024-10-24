import { Observable } from "rxjs"

export const delayUnsubscription =
  (ms?: number) =>
  <T>(source: Observable<T>): Observable<T> =>
    new Observable((observer) => {
      const subscription = source.subscribe({
        next(v) {
          observer.next(v)
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })
      const unsubscribe = () => subscription.unsubscribe()
      return () => {
        if (ms != null) setTimeout(unsubscribe, ms)
        else Promise.resolve().then(unsubscribe)
      }
    })
