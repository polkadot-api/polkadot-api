import { Observable } from "rxjs"
import { vi, Mock as _ } from "vitest"
import { withCallback } from "./spies"

export function observe<T>(obs$: Observable<T>) {
  const next = withCallback(vi.fn<[T], void>())
  const error = withCallback(vi.fn<[any], void>())
  const complete = withCallback(vi.fn<[], void>())

  const subscription = obs$.subscribe({
    next,
    error,
    complete,
  })
  const unsubscribe = () => subscription.unsubscribe()
  const getLastEmission = () => next.mock.calls.at(-1)?.[0]

  return { next, error, complete, getLastEmission, unsubscribe }
}
