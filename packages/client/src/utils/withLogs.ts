import { Observable } from "rxjs"

export const withLogs =
  (msg: string) =>
  <T>(base: Observable<T>): Observable<T> => {
    return new Observable((observer) => {
      console.log(`withLogs(${msg}): subsribed`)
      const sub = base.subscribe({
        next(v) {
          console.log(`withLogs(${msg}): next`, v)
          observer.next(v)
        },
        error(e) {
          console.log(`withLogs(${msg}): error`, e)
          observer.error(e)
        },
        complete() {
          console.log(`withLogs(${msg}): complete`)
          observer.complete()
        },
      })

      return () => {
        console.log(`withLogs(${msg}): cleanup`)
        sub.unsubscribe()
      }
    })
  }
