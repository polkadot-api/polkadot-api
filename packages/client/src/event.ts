import { Observable, firstValueFrom, map, mergeMap } from "rxjs"
import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import { CompatibilityFunctions, CompatibilityHelper } from "./compatibility"
import { concatMapEager, shareLatest } from "./utils"

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

export type EvClient<Unsafe, D, T> = {
  /**
   * Multicast and stateful Observable watching for new events (matching the
   * event kind chosen) in the latest known `finalized` block.
   *
   * @param filter  Optional filter function to only emit events complying
   *                with the function.
   */
  watch: EvWatch<T>
  /**
   * Fetch (Promise-based) all events (matching the event kind chosen) available
   * in the latest known `finalized` block.
   */
  pull: EvPull<T>
  /**
   * Filter a bunch of `SystemEvent` and return the decoded `payload` of every
   * of them.
   *
   * @param collection  Array of `SystemEvent` to filter.
   */
  filter: EvFilter<T>
} & (Unsafe extends true ? {} : CompatibilityFunctions<D>)

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

export const createEventEntry = <D, T>(
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  {
    isCompatible,
    getCompatibilityLevel,
    withCompatibleRuntime,
    argsAreCompatible,
    valuesAreCompatible,
  }: CompatibilityHelper,
): EvClient<any, D, T> => {
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry Event(${pallet}.${name})`)

  const shared$ = chainHead.finalized$.pipe(
    withCompatibleRuntime(chainHead, (x) => x.hash),
    map(([block, runtime, ctx]) => {
      const eventsIdx = ctx.lookup.metadata.pallets.find(
        (p) => p.name === pallet,
      )?.events?.type
      if (
        eventsIdx == null ||
        ctx.lookup.metadata.lookup[eventsIdx].def.tag !== "variant" ||
        ctx.lookup.metadata.lookup[eventsIdx].def.value.find(
          (ev) => ev.name === name,
        ) == null
      )
        throw new Error(`Runtime entry Event(${pallet}.${name}) not found`)

      if (!argsAreCompatible(runtime, ctx, null)) throw compatibilityError()
      return [block, runtime, ctx] as const
    }),
    concatMapEager(([block, runtime, ctx]) =>
      chainHead.eventsAt$(block.hash).pipe(
        map((events) => {
          const winners = events.filter(
            (e) => e.event.type === pallet && e.event.value.type === name,
          )
          return winners.map((x) => {
            if (!valuesAreCompatible(runtime, ctx, x.event.value.value))
              throw compatibilityError()
            return {
              meta: {
                phase: x.phase,
                block,
              },
              payload: x.event.value.value,
            }
          })
        }),
      ),
    ),
    shareLatest,
  )

  const watch: EvWatch<T> = (f) =>
    shared$.pipe(mergeMap((x) => (f ? x.filter((d) => f(d.payload)) : x)))

  const pull: EvPull<T> = () => firstValueFrom(shared$)

  const filter: EvFilter<T> = (events) =>
    events
      .filter((e) => e.type === pallet && e.value.type === name)
      .map((x) => x.value.value)

  return { watch, pull, filter, getCompatibilityLevel, isCompatible }
}
