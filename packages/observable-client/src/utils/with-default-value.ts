import { Observable } from "rxjs"

export const withDefaultValue =
  <V, T>(defaultValue: V) =>
  (source$: Observable<T>): Observable<V | T> =>
    new Observable((observer) => {
      let hasEmited = false

      const subscription = source$.subscribe({
        next(v) {
          hasEmited = true
          observer.next(v)
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })

      if (!hasEmited) observer.next(defaultValue)

      return subscription
    })
