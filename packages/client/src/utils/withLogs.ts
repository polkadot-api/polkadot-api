import { Observable } from "rxjs"

export const withLogs =
  (msg: string, withSubId?: boolean) =>
  <T>(base: Observable<T>): Observable<T> => {
    let nextId = 0
    return new Observable((observer) => {
      const id = nextId++
      const log = (...args: any[]) =>
        console.log(...(withSubId ? [id, ...args] : args))
      log(`withLogs(${msg}): subscribed`)
      const sub = base.subscribe({
        next(v) {
          log(`withLogs(${msg}): next`, v)
          observer.next(v)
        },
        error(e) {
          log(`withLogs(${msg}): error`, e)
          observer.error(e)
        },
        complete() {
          log(`withLogs(${msg}): complete`)
          observer.complete()
        },
      })

      return () => {
        log(`withLogs(${msg}): cleanup`)
        sub.unsubscribe()
      }
    })
  }
