import { Observable } from "rxjs"

export const fromAbortControllerFn =
  <A extends Array<any>, T>(
    fn: (...args: [...A, ...[abortSignal: AbortSignal]]) => Promise<T>,
  ) =>
  (...args: A): Observable<T> =>
    new Observable((observer) => {
      const aborter = new AbortController()

      fn(...[...args, aborter.signal]).then(
        (value: any) => {
          observer.next(value)
          observer.complete()
        },
        (error: any) => {
          observer.error(error)
        },
      )

      return () => {
        aborter.abort()
      }
    })
