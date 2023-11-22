import { PlainDescriptor } from "@polkadot-api/substrate-bindings"
import { Codecs$ } from "./codecs"
import {
  Observable,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  startWith,
  withLatestFrom,
} from "rxjs"
import { Storage$ } from "./storage"
import { shareLatest } from "./utils"

type EvWatch<T> = (filter?: (value: T) => boolean) => Observable<{
  meta: {
    blockHash: string
    txIdx: number
  }
  payload: T
}>

type EvPull<T> = () => Promise<
  Array<{
    meta: {
      blockHash: string
      txIdx: number
    }
    payload: T
  }>
>

export type EvClient<T> = {
  watch: EvWatch<T>
  pull: EvPull<T>
}

type SystemEvent = {
  phase:
    | { tag: "ApplyExtrinsic"; value: number }
    | { tag: "Finalization" }
    | { tag: "Initialization" }
  event: {
    tag: string
    value: {
      tag: string
      value: any
    }
  }
  topics: Array<any>
}

export const createEventEntry = <T>(
  checksum: PlainDescriptor<T>,
  pallet: string,
  name: string,
  codecs$: Codecs$,
  finalized: Observable<string>,
  storage$: Storage$,
): EvClient<T> => {
  const shared$ = finalized.pipe(
    withLatestFrom(codecs$),
    mergeMap(([block, getCodecs]) => {
      if (!getCodecs) return []
      const [, evCodecs] = getCodecs("stg", "System", "Events")
      const [actualChecksum] = getCodecs("ev", pallet, name)

      if (checksum !== actualChecksum)
        throw new Error(`Incompatible runtime entry Event(${pallet}.${name})`)

      return storage$(block, "value", evCodecs.enc(), null).pipe(
        map((x) => {
          const events = evCodecs.dec(x!) as Array<SystemEvent>
          const winners = events.filter(
            (e) =>
              e.phase.tag === "ApplyExtrinsic" &&
              e.event.tag === pallet &&
              e.event.value.tag === name,
          )
          return winners.map((x) => {
            const txIdx = (x.phase as unknown as { value: number }).value

            return {
              meta: {
                txIdx,
                blockHash: block,
              },
              payload: x.event.value.value,
            }
          })
        }),
        startWith(null),
      )
    }),
    shareLatest,
  )

  const watch: EvWatch<T> = (f) =>
    shared$.pipe(
      filter(Boolean),
      mergeMap((x) => (f ? x.filter((d) => f(d.payload)) : x)),
    )

  const pull: EvPull<T> = () => firstValueFrom(shared$.pipe(filter(Boolean)))

  return { watch, pull }
}
