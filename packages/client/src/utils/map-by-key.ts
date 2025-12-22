import { Observable, Observer, Subscription } from "rxjs"

/**
 * Similar to combineKeys + partitionByKey of rx-state, but:
 * - mapFn only takes the initialValue - the result value will be there as long
 * as it's still in the source.
 */
export const mapByKey = <T, K, R>(
  source: Observable<T[]>,
  keySelector: (value: T) => K,
  mapFn: (value: T, key: K) => Observable<R>,
): Observable<Map<K, R>> =>
  new Observable((obs) => {
    const empty = {}
    const inner = new Map<
      K,
      {
        value: R | typeof empty
        sub: Subscription
      }
    >()
    let sourceClosed = false

    const emitValue = () =>
      obs.next(
        new Map(
          Array.from(inner.entries())
            .filter(([, entry]) => entry !== empty)
            .map(([key, entry]) => [key, entry.value as R]),
        ),
      )

    const innerObs = (key: K): Observer<R> => ({
      next(value) {
        const entry = inner.get(key)
        if (!entry) return
        entry.value = value
        emitValue()
      },
      error(err) {
        obs.error(err)
      },
      complete() {
        if (!inner.has(key)) return
        inner.delete(key)
        emitValue()
        if (inner.size == 0 && sourceClosed) {
          obs.complete()
        }
      },
    })

    const sourceSub = source.subscribe({
      next(value) {
        value.forEach((v) => {
          const key = keySelector(v)
          if (inner.has(key)) return
          inner.set(key, {
            value: empty,
            sub: mapFn(v, key).subscribe(innerObs(key)),
          })
        })
      },
      error(err) {
        obs.error(err)
      },
      complete() {
        sourceClosed = true
        if (inner.size == 0) {
          obs.complete()
        }
      },
    })

    return () => {
      sourceSub.unsubscribe()
      inner.forEach((entry) => entry.sub.unsubscribe())
    }
  })
