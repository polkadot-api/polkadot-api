import { Observable, ReplaySubject, share } from "rxjs"

export const shareLatest: <T>(base: Observable<T>) => Observable<T> = share({
  connector: () => new ReplaySubject(1),
  resetOnError: true,
  resetOnComplete: true,
  resetOnRefCountZero: true,
})
