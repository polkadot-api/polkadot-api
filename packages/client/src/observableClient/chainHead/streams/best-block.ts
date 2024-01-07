import type {
  BestBlockChanged,
  FollowEventWithRuntime,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  Subject,
  Subscription,
  concatMap,
  startWith,
  tap,
  withLatestFrom,
} from "rxjs"

import { combineLatest, filter, map } from "rxjs"
import { shareLatest } from "@/utils"
import { BlockHeader } from "@polkadot-api/substrate-bindings"

export const getBestBlock$ = (follow$: Observable<FollowEventWithRuntime>) =>
  follow$.pipe(
    filter((e): e is BestBlockChanged => e.type === "bestBlockChanged"),
    map((e) => e.bestBlockHash),
    shareLatest,
  )

export type BlockHeaderWithHash = BlockHeader & { hash: string }

export const getBestBlocks$ = (
  best$: Observable<string>,
  finalized$: Observable<string>,
  getHeader$: (hash: string) => Observable<BlockHeaderWithHash>,
): Observable<Array<BlockHeaderWithHash>> => {
  const _current$ = new Subject<Map<string, BlockHeaderWithHash>>()
  const getBlocks$ = (
    best: string,
    finalized: string,
    current: Map<string, BlockHeaderWithHash>,
  ): Observable<Map<string, BlockHeaderWithHash>> =>
    new Observable((observer) => {
      const result = new Map<string, BlockHeaderWithHash>()
      let sub: Subscription

      const process = (hash: string) => {
        if (hash === finalized) {
          observer.next(result)
          observer.complete()
          return
        }

        const header = current.get(hash)
        if (header) {
          result.set(hash, header)
          process(header.parentHash)
          return
        }

        sub = getHeader$(hash).subscribe({
          next(header) {
            result.set(hash, header)
            process(header.parentHash)
          },
          error(e) {
            observer.error(e)
          },
        })
      }

      process(best)

      return () => {
        sub?.unsubscribe()
      }
    })

  return combineLatest({ best: best$, finalized: finalized$ }).pipe(
    withLatestFrom(_current$.pipe(startWith(new Map()))),
    concatMap(([{ best, finalized }, current]) =>
      getBlocks$(best, finalized, current).pipe(
        tap((x) => {
          _current$.next(x)
        }),
        map((state) => {
          const result: Array<BlockHeaderWithHash> = []
          let current = best
          while (current !== finalized) {
            const value = state.get(current)!
            result.push(value)
            current = value.parentHash
          }
          return result
        }),
      ),
    ),
    shareLatest,
  )
}
