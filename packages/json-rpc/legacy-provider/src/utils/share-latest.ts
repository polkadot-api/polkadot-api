import { Observable, shareReplay } from "rxjs"

export const shareLatest: <T>(base: Observable<T>) => Observable<T> =
  shareReplay({
    refCount: true,
    bufferSize: 1,
  })
