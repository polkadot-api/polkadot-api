import { Observable, Subscription } from "rxjs"

export const raceMap =
  <I, O>(mapper: (x: I) => Observable<O>, concurrent: number) =>
  (source$: Observable<I>) =>
    new Observable<O>((observer) => {
      let innerSubscriptions = new Array<Subscription>()
      let isOuterDone = false

      const createSubscription = (value: I) => {
        const sub = new Subscription()
        innerSubscriptions.push(sub)
        if (innerSubscriptions.length > concurrent) {
          innerSubscriptions[0].unsubscribe()
          innerSubscriptions = innerSubscriptions.slice(1)
        }

        const subscription = mapper(value).subscribe({
          next(value) {
            const index = innerSubscriptions.indexOf(sub)
            innerSubscriptions.slice(0, index).forEach((s) => s.unsubscribe())
            innerSubscriptions = innerSubscriptions.slice(index)

            observer.next(value)
          },
          error(error) {
            observer.error(error)
          },
          complete() {
            const index = innerSubscriptions.indexOf(sub)
            innerSubscriptions.splice(index, 1)

            if (innerSubscriptions.length === 0 && isOuterDone)
              observer.complete()
          },
        })
        sub.add(subscription)
      }

      const outerSubscription = source$.subscribe({
        next(value) {
          createSubscription(value)
        },
        error(err) {
          observer.error(err)
        },
        complete() {
          if (innerSubscriptions.length === 0) observer.complete()
          isOuterDone = true
        },
      })

      return () => {
        outerSubscription.unsubscribe()
        innerSubscriptions.forEach((sub) => sub.unsubscribe())
      }
    })
