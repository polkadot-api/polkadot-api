import { PlainDescriptor } from "@polkadot-api/substrate-bindings"
import { Observable, firstValueFrom, map, mergeMap } from "rxjs"
import { Storage$ } from "./storage"
import { concatMapEager, shareLatest } from "./utils"
import { RuntimeContext } from "./observableClient/chainHead/chainHead"

export type EventPhase =
  | { tag: "ApplyExtrinsic"; value: number }
  | { tag: "Finalization" }
  | { tag: "Initialization" }

export type EvWatch<T> = (filter?: (value: T) => boolean) => Observable<{
  meta: {
    blockHash: string
    phase: EventPhase
  }
  payload: T
}>

export type EvPull<T> = () => Promise<
  Array<{
    meta: {
      blockHash: string
      phase: EventPhase
    }
    payload: T
  }>
>

export type EvClient<T> = {
  watch: EvWatch<T>
  pull: EvPull<T>
}

type SystemEvent = {
  phase: EventPhase
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
  getRuntimeContext$: (blockHash: string | null) => Observable<RuntimeContext>,
  finalized: Observable<string>,
  storage$: Storage$,
): EvClient<T> => {
  const shared$ = finalized.pipe(
    concatMapEager((block) =>
      getRuntimeContext$(block).pipe(map((context) => ({ context, block }))),
    ),
    concatMapEager(
      ({
        block,
        context: {
          events: { key, dec },
          checksumBuilder,
        },
      }) => {
        const actualChecksum = checksumBuilder.buildEvent(pallet, name)

        if (checksum !== actualChecksum)
          throw new Error(`Incompatible runtime entry Event(${pallet}.${name})`)

        return storage$(block, "value", key, null).pipe(
          map((x) => {
            const events = dec(x!) as Array<SystemEvent>
            const winners = events.filter(
              (e) => e.event.tag === pallet && e.event.value.tag === name,
            )
            return winners.map((x) => {
              return {
                meta: {
                  phase: x.phase,
                  blockHash: block,
                },
                payload: x.event.value.value,
              }
            })
          }),
        )
      },
    ),
    shareLatest,
  )

  const watch: EvWatch<T> = (f) =>
    shared$.pipe(mergeMap((x) => (f ? x.filter((d) => f(d.payload)) : x)))

  const pull: EvPull<T> = () => firstValueFrom(shared$)

  return { watch, pull }
}
