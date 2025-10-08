import { DecentHeader, ShittyHeader } from "../../types"
import { getFromShittyHeader } from "../../utils/fromShittyHeader"
import { getHasherFromBlock } from "../../utils/get-hasher-from-block"
import { shareLatest } from "../../utils/share-latest"
import { withLatestFromBp } from "../../utils/with-latest-from-bp"
import { ClientRequest } from "@polkadot-api/raw-client"
import { HexString } from "@polkadot-api/substrate-bindings"
import { noop } from "@polkadot-api/utils"
import { concat, map, mergeMap, Observable, of, pipe, Subject } from "rxjs"

export const getUpstreamEvents = (
  request: ClientRequest<any, any>,
  request$: <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
  ) => Observable<Payload>,
) => {
  const firstFinHeader$ = new Subject<ShittyHeader>()
  const hasher$ = firstFinHeader$.pipe(
    mergeMap((h) =>
      request$<[number | string], HexString>("chain_getBlockHash", [
        h.number,
      ]).pipe(map(getHasherFromBlock(h))),
    ),
    shareLatest,
  )
  const fromShittyHeader$ = hasher$.pipe(map(getFromShittyHeader), shareLatest)
  const toNiceHeader = pipe(
    withLatestFromBp<
      (x: ShittyHeader) => ReturnType<ReturnType<typeof getFromShittyHeader>>,
      ShittyHeader
    >(fromShittyHeader$),
    map(([fromShittyHeader, shitHeader]) => fromShittyHeader(shitHeader)),
  )

  const getHeaders$ = (
    startMethod: string,
    stopMethod: string,
    isFin = false,
  ): Observable<DecentHeader> =>
    new Observable<ShittyHeader>((observer) => {
      const onError = (e: any) => {
        observer.error(e)
      }

      let stop: (() => void) | null = null
      let isFirstFin = isFin
      ;(request as ClientRequest<string, ShittyHeader>)(startMethod, [], {
        onSuccess: (subId, followSub) => {
          const done = followSub(subId, {
            next: (v) => {
              if (isFirstFin) {
                isFirstFin = false
                firstFinHeader$.next(v)
                firstFinHeader$.complete()
              }
              observer.next(v)
            },
            error: onError,
          })
          const unsubscribe = () => {
            done()
            try {
              request(stopMethod, [subId], {
                onError: noop,
                onSuccess: noop,
              })
            } catch {}
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
    }).pipe(toNiceHeader)

  const allHeads$ = getHeaders$(
    "chain_subscribeAllHeads",
    "chain_unsubscribeAllHeads",
  )

  const finalized$ = getHeaders$(
    "chain_subscribeFinalizedHeads",
    "chain_unsubscribeFinalizedHeads",
    true,
  )

  const getHeader$ = (hash: string) =>
    request$<[string], ShittyHeader>("chain_getHeader", [hash]).pipe(
      toNiceHeader,
    )

  const getRecursiveHeader = (hash: string): Observable<DecentHeader> =>
    getHeader$(hash).pipe(
      mergeMap((header) =>
        concat(of(header), getRecursiveHeader(header.parent)),
      ),
    )

  return {
    allHeads$,
    finalized$,
    hasher$,
    getRecursiveHeader,
    getHeader$,
  }
}

export type UpstreamEvents = ReturnType<typeof getUpstreamEvents>
