import { Observable } from "rxjs"
import { vi, Mock as _ } from "vitest"

export function observe<T>(obs$: Observable<T>) {
  const next = vi.fn<[T], void>()
  const error = vi.fn<[any], void>()
  const complete = vi.fn<[], void>()

  const subscription = obs$.subscribe({
    next,
    error,
    complete,
  })
  const unsubscribe = () => subscription.unsubscribe()
  const getLastEmission = () => next.mock.calls.at(-1)?.[0]

  return { next, error, complete, getLastEmission, unsubscribe }
}
