import { BlockNotPinnedError } from "@/chainHead"
import { catchError, Observable } from "rxjs"

export const withArchive =
  <Args extends Array<any>, T, Hash extends string | (string | null)>(
    chainHeadFn: (blockHash: Hash, ...args: Args) => Observable<T>,
    archiveFn: (blockHash: string, ...args: Args) => Observable<T>,
  ): ((blockHash: Hash, ...args: Args) => Observable<T>) =>
  (blokHash, ...args) =>
    chainHeadFn(blokHash, ...args).pipe(
      catchError((e) => {
        if (!(e instanceof BlockNotPinnedError)) throw e

        return archiveFn(blokHash as string, ...args).pipe(
          catchError((actualErr) => {
            console.warn(actualErr)
            throw e
          }),
        )
      }),
    )
