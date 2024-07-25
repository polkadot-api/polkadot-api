import { Mock } from "vitest"

export type Procedure<T extends any[], R = any> = (...args: T) => R
type MockArgs<T> = T extends Mock<Procedure<infer R, unknown>> ? R : never

export type WithCallback<T = Mock> = T & {
  callback: (cb: (...args: MockArgs<T>) => void) => () => void
}

export function withCallback<M extends Mock<Procedure<any[], any>>>(
  spy: M,
): WithCallback<M> {
  type A = MockArgs<M>

  const watchers = new Set<(...args: A) => void>()

  const fn = spy.getMockImplementation()

  spy.mockImplementation((...args: A) => {
    watchers.forEach((w) => w(...args))
    return fn?.(...args) as any
  })

  return Object.assign(spy, {
    callback: (cb: (...args: A) => void) => {
      watchers.add(cb)
      return () => watchers.delete(cb)
    },
  })
}

export type WithWait<T = Mock> = T & {
  waitNextCall: () => Promise<MockArgs<T>>
}
export function withWait<M extends Mock<Procedure<any[], any>>>(
  spy: M,
): WithWait<M> {
  type A = MockArgs<M>

  let promise: DeferredPromise<A> | null = null

  const fn = spy.getMockImplementation()
  spy.mockImplementation((...args: A) => {
    if (promise) {
      promise.res(args)
      promise = null
    }
    return fn?.(...args) as any
  })

  return Object.assign(spy, {
    waitNextCall: async () => {
      if (!promise) {
        promise = deferred()
      }
      return promise
    },
  })
}

export interface DeferredPromise<T> extends Promise<T> {
  res: (value: T) => void
  rej: (err: Error) => void
}

export function deferred<T>(): DeferredPromise<T> {
  let res: (value: T) => void = () => {}
  let rej: (err: Error) => void = () => {}

  const promise = new Promise<T>((_res, _rej) => {
    res = _res
    rej = _rej
  })

  return Object.assign(promise, { res, rej })
}
