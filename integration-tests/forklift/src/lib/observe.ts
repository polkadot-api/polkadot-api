import {
  defer,
  Observable,
  pipe,
  ReplaySubject,
  scan,
  startWith,
  Subject,
} from "rxjs"
import { vi, Mock as _ } from "vitest"

export function observe<T>(obs$: Observable<T>) {
  const next = vi.fn<(value: T) => void>()
  const error = vi.fn<(value: any) => void>()
  const complete = vi.fn<() => void>()

  let replaySubject = new ReplaySubject<T>()
  const subject = new Subject<T>()
  const subscription = obs$.subscribe({
    next: (v) => {
      next(v)
      replaySubject.next(v)
      subject.next(v)
    },
    error: (v) => {
      error(v)
      replaySubject.error(v)
      subject.error(v)
    },
    complete: () => {
      complete()
      replaySubject.complete()
      subject.complete()
    },
  })
  const unsubscribe = () => {
    subscription.unsubscribe()
    replaySubject.unsubscribe()
    subject.unsubscribe()
  }
  const getLastEmission = () => next.mock.calls.at(-1)?.[0]
  const clearNext = () => {
    replaySubject.unsubscribe()
    replaySubject = new ReplaySubject()
    next.mockClear()
  }

  return {
    next,
    error,
    complete,
    clearNext,
    getLastEmission,
    replay$: defer(() => replaySubject),
    next$: subject.asObservable(),
    unsubscribe,
  }
}

export const accumulate = <T>() =>
  pipe(
    scan((acc: T[], v: T) => [...acc, v], []),
    startWith([]),
  )
