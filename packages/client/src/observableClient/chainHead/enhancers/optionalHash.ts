import { Observable, mergeMap, of, take } from "rxjs"

export const getWithOptionalhash$ = (
  finalized$: Observable<string>,
  best$: Observable<string>,
) => {
  return <Args extends Array<any>, T>(
      fn: (hash: string, ...args: Args) => Observable<T>,
    ) =>
    (hash: string | null, ...args: Args) => {
      const hash$ =
        hash === null || hash === "finalized"
          ? finalized$
          : hash === "best"
            ? best$
            : of(hash)

      return hash$.pipe(
        take(1),
        mergeMap((h) => fn(h, ...args)),
      )
    }
}
