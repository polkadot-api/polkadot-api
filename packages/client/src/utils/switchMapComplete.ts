import { Observable, OperatorFunction, Subscription } from "rxjs"

export function switchMapComplete<T, O>(
  project: (value: T) => Observable<O>,
): OperatorFunction<T, O> {
  return (source: Observable<T>): Observable<O> =>
    new Observable((observer) => {
      let innerSubscription: Subscription | null = null
      let outterSubscription = source.subscribe({
        next(v) {
          innerSubscription?.unsubscribe()
          innerSubscription = project(v).subscribe({
            next(iV) {
              observer.next(iV)
            },
            error(e) {
              observer.error(e)
            },
          })
        },
        complete() {
          observer.complete()
        },
        error(e) {
          observer.error(e)
        },
      })

      return () => {
        innerSubscription?.unsubscribe()
        outterSubscription.unsubscribe()
        innerSubscription = null
      }
    })
}
