import { AbortError, noop } from "@polkadot-api/utils"
import { AbortablePromiseFn } from "../common-types"

export const abortablePromiseFn =
  <T, A extends Array<any>>(
    fn: (
      ...args: [...[res: (x: T) => void, rej: (e: any) => void], ...A]
    ) => () => void,
  ): AbortablePromiseFn<A, T> =>
  (...args): Promise<T> =>
    new Promise((res, rej) => {
      let cancel = noop

      const [actualArgs, abortSignal] =
        args[args.length - 1] instanceof AbortSignal
          ? ([args.slice(0, args.length - 1), args[args.length - 1]] as [
              A,
              AbortSignal,
            ])
          : ([args] as unknown as [A])

      const onAbort = () => {
        cancel()
        rej(new AbortError())
      }

      abortSignal?.addEventListener("abort", onAbort, { once: true })

      const withCleanup =
        <T>(fn: (x: T) => void): ((x: T) => void) =>
        (x) => {
          cancel = noop
          abortSignal?.removeEventListener("abort", onAbort)
          fn(x)
        }

      cancel = fn(...[withCleanup(res), withCleanup(rej), ...actualArgs])
    })
