import { OperationInaccessibleError } from "@polkadot-api/substrate-client"
import { catchError, concatMap, Observable, throwError, timer } from "rxjs"

export const withOperationInaccessibleRetry = <T>(source$: Observable<T>) => {
  const result: Observable<T> = source$.pipe(
    catchError((e) =>
      e instanceof OperationInaccessibleError
        ? timer(750).pipe(concatMap(() => result))
        : throwError(() => e),
    ),
  )
  return result
}
