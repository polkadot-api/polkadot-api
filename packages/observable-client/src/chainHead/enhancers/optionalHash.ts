import {
  MonoTypeOperatorFunction,
  Observable,
  catchError,
  mergeMap,
  take,
  throwError,
} from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { withOperationInaccessibleRetry } from "./operation-inaccessible-retry"

const dynamicBlocks = new Set(["best", "finalized", null])

export const getWithOptionalHash$ = (
  finalized$: Observable<string>,
  best$: Observable<string>,
  usingBlock: <T>(blockHash: string) => MonoTypeOperatorFunction<T>,
) => {
  return <Args extends Array<any>, T>(
      fn: (hash: string, ...args: Args) => Observable<T>,
    ) =>
    (hash: string | null, ...args: Args) => {
      if (!dynamicBlocks.has(hash))
        return withOperationInaccessibleRetry(fn(hash as string, ...args)).pipe(
          usingBlock(hash as string),
        )

      const hash$ = hash === "best" ? best$ : finalized$
      const result$: Observable<T> = hash$.pipe(
        take(1),
        mergeMap((h) => fn(h, ...args).pipe(usingBlock(h))),
        catchError((e) => {
          return e instanceof BlockNotPinnedError
            ? result$
            : throwError(() => e)
        }),
      )
      return withOperationInaccessibleRetry(result$)
    }
}
