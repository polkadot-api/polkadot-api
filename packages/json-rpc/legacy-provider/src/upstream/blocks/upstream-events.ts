import { DecentHeader, ShittyHeader } from "@/types"
import { ClientRequest } from "@polkadot-api/raw-client"
import { noop } from "@polkadot-api/utils"
import {
  combineLatest,
  concat,
  map,
  mergeMap,
  Observable,
  of,
  share,
  shareReplay,
  take,
  takeUntil,
  toArray,
} from "rxjs"

export const getUpstreamEvents = (
  request: ClientRequest<any, any>,
  getHeader: (hash: string) => Observable<DecentHeader>,
  fromShittyHeader: (header: ShittyHeader) => DecentHeader,
) => {
  const getHeaders$ = (
    startMethod: string,
    stopMethod: string,
  ): Observable<DecentHeader> =>
    new Observable<ShittyHeader>((observer) => {
      const onError = (e: any) => {
        observer.error(e)
      }

      let stop: (() => void) | null = null
      ;(request as ClientRequest<string, ShittyHeader>)(startMethod, [], {
        onSuccess: (subId, followSub) => {
          const done = followSub(subId, {
            next: (v) => {
              observer.next(v)
            },
            error: onError,
          })
          const unsubscribe = () => {
            done()
            request(stopMethod, [subId])
          }
          if (stop !== null) unsubscribe()
          else stop = unsubscribe
        },
        onError,
      })

      return () => {
        stop?.()
        stop = noop
      }
    }).pipe(map(fromShittyHeader))

  const allHeads$ = getHeaders$(
    "chain_subscribeAllHeads",
    "chain_unsubscribeAllHeads",
  ).pipe(share())

  const finalized$ = getHeaders$(
    "chain_subscribeFinalizedHeads",
    "chain_unsubscribeFinalizedHeads",
  ).pipe(shareReplay(1))

  const getRecurseiveHeader = (hash: string): Observable<DecentHeader> =>
    getHeader(hash).pipe(
      mergeMap((header) =>
        concat(of(header), getRecurseiveHeader(header.parent)),
      ),
    )

  const gap$: Observable<DecentHeader[]> = combineLatest(
    allHeads$.pipe(take(1)),
    finalized$.pipe(take(1)),
  ).pipe(
    mergeMap(([latest, fin]) => {
      const nMissing = latest.number - fin.number - 1
      return concat(
        getRecurseiveHeader(latest.parent).pipe(take(Math.max(0, nMissing))),
        of(fin),
      )
    }),
    toArray(),
    share(),
  )
  const collected$ = allHeads$.pipe(takeUntil(gap$), toArray())
  const initial$ = combineLatest([collected$, gap$]).pipe(
    map(([collected, gap]) => [...gap.reverse(), ...collected]),
  )

  return {
    initial$,
    allHeads$,
    finalized$,
  }
}

export type UpstreamEvents = ReturnType<typeof getUpstreamEvents>
