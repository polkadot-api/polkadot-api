import { OperationInaccessibleError } from "@polkadot-api/substrate-client"
import { Observable, catchError, concatMap, throwError, timer } from "rxjs"

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

export const withOperationInaccessibleRecovery =
  <Args extends Array<any>, T>(fn: (...args: Args) => Observable<T>) =>
  (...args: Args): Observable<T> =>
    operable(fn(...args))
