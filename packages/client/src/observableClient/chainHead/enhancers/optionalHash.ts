import {
  Observable,
  ReplaySubject,
  concat,
  mergeMap,
  of,
  share,
  take,
  takeWhile,
} from "rxjs"

const DONE = Symbol("DONE")
type DONE = typeof DONE

const delayUnsubscription = <T>(source$: Observable<T>) =>
  new Observable<T>((observer) => {
    const subscription = source$.subscribe(observer)
    return () => {
      setTimeout(() => {
        subscription.unsubscribe()
      }, 0)
    }
  })

export const getWithOptionalhash$ = (finalized$: Observable<string>) => {
  const current$ = finalized$.pipe(
    take(1),
    share({
      connector: () => new ReplaySubject(1),
      resetOnError: true,
      resetOnRefCountZero: true,
      resetOnComplete: false,
    }),
    delayUnsubscription,
  )

  return <Args extends Array<any>, T>(
      fn: (hash: string, ...args: Args) => Observable<T>,
    ) =>
    (hash: string | null, ...args: Args) =>
      hash
        ? fn(hash, ...args)
        : current$.pipe(
            mergeMap((h) => concat(fn(h, ...args), of(DONE))),
            takeWhile((x): x is T => x !== DONE),
          )
}
