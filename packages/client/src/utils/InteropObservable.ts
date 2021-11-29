import type { InteropObservable } from "../types"

if (!Symbol["observable"]) {
  Object.defineProperty(Symbol, "observable", {
    value: Symbol("observable"),
  })
}

export const getInteropObservable = <T>(
  fn: (observer: {
    next: (value: T) => void
    error: (e: unknown) => void
  }) => () => void,
  namespace: string,
): InteropObservable<T> => {
  const defaultOnError = (e: unknown) => {
    console.log(`An uncaught error ocurred on ${namespace}!`)
    console.error(e)
  }

  const realSubscribe = (
    next: (value: T) => void,
    error: (e: unknown) => void = defaultOnError,
  ): (() => void) => fn({ next, error })

  return {
    subscribe: realSubscribe,
    [Symbol.observable]() {
      return {
        subscribe(
          nextOrObserver: any,
          error: any = Function.prototype,
          complete: any = Function.prototype,
        ) {
          const observer =
            typeof nextOrObserver === "function"
              ? { next: nextOrObserver, error, complete }
              : nextOrObserver

          const unsubscribe = realSubscribe(
            observer.next.bind(observer),
            observer.error.bind(observer),
          )

          return { unsubscribe }
        },
      }
    },
  }
}
