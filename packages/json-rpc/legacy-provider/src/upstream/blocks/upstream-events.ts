import { DecentHeader, ShittyHeader } from "@/types"
import { fromShittyHeader } from "@/utils/fromShittyHeader"
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
  withLatestFrom,
} from "rxjs"

export const getUpstreamEvents = (request: ClientRequest<any, any>) => {
  const getHeader = (hash: string) =>
    new Observable<DecentHeader>((observer) =>
      request("chain_getHeader", [hash], {
        onSuccess(x: ShittyHeader) {
          observer.next(fromShittyHeader(x))
          observer.complete()
        },
        onError(e) {
          observer.error(e)
        },
      }),
    )

  const getHeaders$ = (
    startMethod: string,
    stopMethod: string,
  ): Observable<DecentHeader> =>
    new Observable<ShittyHeader>((observer) => {
      const onError = (e: any) => {
        observer.error(e)
      }

      let stop = (request as ClientRequest<string, ShittyHeader>)(
        startMethod,
        [],
        {
          onSuccess: (subId, followSub) => {
            const done = followSub(subId, {
              next: (v) => {
                observer.next(v)
              },
              error: onError,
            })
            stop = () => {
              done()
              request(stopMethod, [subId])
            }
          },
          onError,
        },
      )

      return () => {
        stop()
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

  const gap$: Observable<DecentHeader[]> = allHeads$.pipe(
    withLatestFrom(finalized$),
    take(1),
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
    finalized$: finalized$.pipe(map((x) => x.hash)),
  }
}

export type UpstreamEvents = ReturnType<typeof getUpstreamEvents>
