import { HexString } from "@polkadot-api/substrate-bindings"
import {
  EMPTY,
  Observable,
  combineLatest,
  concat,
  filter,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
  takeWhile,
} from "rxjs"
import { ChainHead$, SystemEvent } from "@polkadot-api/observable-client"
import { AnalyzedBlock } from "@polkadot-api/observable-client"
import { TxBroadcastEvent } from "./types"
import { TxEventsPayload } from "./types"

const tx$ = (
  chainHead: ChainHead$,
  broadcastTx$: (tx: string) => Observable<never>,
  tx: string,
  _at?: HexString,
) =>
  concat(
    (_at
      ? of(_at)
      : chainHead.finalized$.pipe(
          take(1),
          map((x) => x.hash),
        )
    ).pipe(
      mergeMap((at) =>
        chainHead.validateTx$(at, tx).pipe(
          map((isValid) => {
            if (!isValid) throw new Error("Invalid")
            return { type: "broadcasted" as "broadcasted" }
          }),
        ),
      ),
    ),
    new Observable<{ type: "analyzed"; value: AnalyzedBlock }>((observer) => {
      const subscription = chainHead
        .trackTx$(tx)
        .pipe(map((value) => ({ type: "analyzed" as const, value })))
        .subscribe(observer)
      subscription.add(
        broadcastTx$(tx).subscribe({
          error(e) {
            observer.error(e)
          },
        }),
      )
      return subscription
    }),
  )

const getTxSuccessFromSystemEvents = (
  systemEvents: Array<SystemEvent>,
  txIdx: number,
): Omit<TxEventsPayload, "block"> => {
  const events = systemEvents
    .filter((x) => x.phase.type === "ApplyExtrinsic" && x.phase.value === txIdx)
    .map((x) => x.event)

  const lastEvent = events[events.length - 1]
  const ok =
    lastEvent.type === "System" && lastEvent.value.type === "ExtrinsicSuccess"

  return { ok, events }
}

export const submit$ = (
  chainHead: ChainHead$,
  broadcastTx$: (tx: string) => Observable<never>,
  transaction: HexString,
  at?: HexString,
): Observable<TxBroadcastEvent> =>
  tx$(chainHead, broadcastTx$, transaction, at).pipe(
    mergeMap((result) => {
      if (result.type === "broadcasted") return of(result)

      if (!result.value.found.type) {
        if (result.value.found.isValid) return EMPTY

        return chainHead.isBestOrFinalizedBlock(result.value.hash).pipe(
          filter((x) => x === "finalized"),
          map(() => {
            throw new Error("Invalid")
          }),
        )
      }

      const { index } = result.value.found
      return combineLatest([
        chainHead
          .isBestOrFinalizedBlock(result.value.hash)
          .pipe(filter(Boolean)),
        result.value.found.events as Observable<Array<SystemEvent>>,
      ]).pipe(
        map(([type, events]) => ({
          type: type === "best" ? ("bestChainBlockIncluded" as const) : type,
          block: {
            hash: result.value.hash,
            index,
          },
          ...getTxSuccessFromSystemEvents(events, index),
        })),
      )
    }),
    takeWhile((e) => e.type !== "finalized", true),
  )

export const submit = async (
  chainHead: ChainHead$,
  broadcastTx$: (tx: string) => Observable<never>,
  transaction: HexString,
  at?: HexString,
): Promise<{
  ok: boolean
  events: Array<SystemEvent["event"]>
  block: { hash: string; index: number }
}> =>
  lastValueFrom(submit$(chainHead, broadcastTx$, transaction, at)).then((x) => {
    if (x.type !== "finalized") throw null
    const result: {
      ok: boolean
      events: Array<SystemEvent["event"]>
      block: { hash: string; index: number }
      type?: any
    } = { ...x }
    delete result.type
    return result
  })
