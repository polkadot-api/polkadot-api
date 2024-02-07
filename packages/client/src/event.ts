import { PlainDescriptor } from "@polkadot-api/substrate-bindings"
import { Observable, firstValueFrom, map, mergeMap } from "rxjs"
import { concatMapEager, shareLatest } from "./utils"
import {
  getObservableClient,
  BlockInfo,
  RuntimeContext,
} from "./observableClient"

export type EventPhase =
  | { type: "ApplyExtrinsic"; value: number }
  | { type: "Finalization" }
  | { type: "Initialization" }

export type EvWatch<T> = (filter?: (value: T) => boolean) => Observable<{
  meta: {
    block: BlockInfo
    phase: EventPhase
  }
  payload: T
}>

export type EvPull<T> = () => Promise<
  Array<{
    meta: {
      block: BlockInfo
      phase: EventPhase
    }
    payload: T
  }>
>

export type EvFilter<T> = (collection: SystemEvent["event"][]) => Array<T>

export type EvClient<T> = {
  watch: EvWatch<T>
  pull: EvPull<T>
  filter: EvFilter<T>
}

type SystemEvent = {
  phase: EventPhase
  event: {
    type: string
    value: {
      type: string
      value: any
    }
  }
  topics: Array<any>
}

export const createEventEntry = <T>(
  checksum: PlainDescriptor<T>,
  pallet: string,
  name: string,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
): EvClient<T> => {
  const checksumCheck = (ctx: RuntimeContext) => {
    const actualChecksum = ctx.checksumBuilder.buildEvent(pallet, name)
    if (checksum !== actualChecksum)
      throw new Error(`Incompatible runtime entry Event(${pallet}.${name})`)
  }

  const shared$ = chainHead.finalized$.pipe(
    chainHead.withRuntime((x) => x.hash),
    concatMapEager(([block, ctx]) => {
      checksumCheck(ctx)
      return chainHead.eventsAt$(block.hash).pipe(
        map((events) => {
          const winners = events.filter(
            (e) => e.event.type === pallet && e.event.value.type === name,
          )
          return winners.map((x) => {
            return {
              meta: {
                phase: x.phase,
                block,
              },
              payload: x.event.value.value,
            }
          })
        }),
      )
    }),
    shareLatest,
  )

  const watch: EvWatch<T> = (f) =>
    shared$.pipe(mergeMap((x) => (f ? x.filter((d) => f(d.payload)) : x)))

  const pull: EvPull<T> = () => firstValueFrom(shared$)

  const filter: EvFilter<T> = (events) =>
    events
      .filter((e) => e.type === pallet && e.value.type === name)
      .map((x) => x.value.value)

  return { watch, pull, filter }
}
