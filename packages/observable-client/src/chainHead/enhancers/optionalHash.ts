import {
  Observable,
  catchError,
  concatMap,
  mergeMap,
  take,
  throwError,
  timer,
} from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { OperationInaccessibleError } from "@polkadot-api/substrate-client"

const dynamicBlocks = new Set(["best", "finalized", null])

const operable = <T>(source$: Observable<T>) => {
  const result: Observable<T> = source$.pipe(
    catchError((e) =>
      e instanceof OperationInaccessibleError
        ? timer(750).pipe(concatMap(() => result))
        : throwError(() => e),
    ),
  )
  return result
}

export const getWithOptionalhash$ = (
  finalized$: Observable<string>,
  best$: Observable<string>,
) => {
  return <Args extends Array<any>, T>(
      fn: (hash: string, ...args: Args) => Observable<T>,
    ) =>
    (hash: string | null, ...args: Args) => {
      if (!dynamicBlocks.has(hash)) return operable(fn(hash as string, ...args))

      const hash$ = hash === "best" ? best$ : finalized$
      const result$: Observable<T> = hash$.pipe(
        take(1),
        mergeMap((h) => fn(h, ...args)),
        catchError((e) => {
          return e instanceof BlockNotPinnedError
            ? result$
            : throwError(() => e)
        }),
      )
      return operable(result$)
    }
}
