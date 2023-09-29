import { Tuple, compact, metadata } from "@polkadot-api/substrate-bindings"
import { Runtime } from "@polkadot-api/substrate-client"
import { Observable, map, startWith, switchMap, withLatestFrom } from "rxjs"
import { shareLatest } from "@/utils"

const opaqueMeta = Tuple(compact, metadata)

export const getMetadata$ = (
  call$: (hash: string, method: string, args: string) => Observable<string>,
  runtime$: Observable<Runtime>,
  finalized$: Observable<string>,
) => {
  const _getMetadata$ = ([, hash]: [runtime: Runtime, hash: string]) =>
    call$(hash, "Metadata_metadata", "").pipe(
      map((response) => {
        const metadata = opaqueMeta.dec(response)[1]
        if (metadata.metadata.tag !== "v14")
          throw new Error("Wrong metadata version")
        return metadata.metadata.value
      }),
      startWith(null),
    )

  return runtime$.pipe(
    withLatestFrom(finalized$),
    switchMap(_getMetadata$),
    shareLatest,
  )
}
