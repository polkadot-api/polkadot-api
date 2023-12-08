import { Observable } from "rxjs"

export const withoutComplete = <T>(source: Observable<T>) =>
  new Observable<T>((observer) =>
    source.subscribe({
      next(x) {
        observer.next(x)
      },
      error(e) {
        observer.error(e)
      },
    }),
  )
