import { Observable } from "rxjs"
import { vi, Mock as _ } from "vitest"
import { Procedure, withCallback } from "./spies"

export function observe<T>(obs$: Observable<T>) {
  const next = withCallback(vi.fn<Procedure<[T], void>>())
  const error = withCallback(vi.fn<Procedure<[any], void>>())
  const complete = withCallback(vi.fn<Procedure<[], void>>())

  const subscription = obs$.subscribe({
    next,
    error,
    complete,
  })
  const unsubscribe = () => subscription.unsubscribe()
  const getLastEmission = () => next.mock.calls.at(-1)?.[0]

  return { next, error, complete, getLastEmission, unsubscribe }
}
