import { Observable, Subscription } from "rxjs"

export const withLatestFromBp =
  <T, S>(latest$: Observable<T>) =>
  (base$: Observable<S>) =>
    new Observable<[T, S]>((observer) => {
      let latest: T
      let prev: S[] | null = []
      let finished = false

      const subscription = new Subscription()
      subscription.add(
        base$.subscribe({
          next(v) {
            if (prev) prev.push(v)
            else observer.next([latest, v])
          },
          error(e) {
            observer.error(e)
          },
          complete() {
            if (prev) finished = true
            else observer.complete()
          },
        }),
      )

      subscription.add(
        latest$.subscribe({
          next(v) {
            latest = v
            if (prev) {
              const copy = [...prev]
              prev = null
              copy.forEach((p) => observer.next([latest, p]))
            }
            if (finished) observer.complete()
          },
          error(e) {
            observer.error(e)
          },
          complete() {
            if (prev) observer.error(new Error("Empty complete"))
          },
        }),
      )

      return subscription
    })
