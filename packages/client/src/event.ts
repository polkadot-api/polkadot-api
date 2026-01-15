import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import { FixedSizeBinary, HexString } from "@polkadot-api/substrate-bindings"
import {
  Observable,
  combineLatest,
  firstValueFrom,
  map,
  switchMap,
  take,
} from "rxjs"
import { ValueCompat } from "./compatibility"
import { concatMapEager, shareLatest } from "./utils"

export type EventPhase =
  | { type: "ApplyExtrinsic"; value: number }
  | { type: "Finalization" }
  | { type: "Initialization" }

export type SystemEvent = {
  phase: EventPhase
  event: {
    type: string
    value: {
      type: string
      value: any
    }
  }
  topics: Array<FixedSizeBinary<32>>
}

export type PalletEvent<T> = {
  original: SystemEvent
  payload: T
}

export type EvClient<T> = {
  /**
   * Fetch (Promise-based) all events (matching the event kind chosen) available
   * in the specific block.
   *
   * @param blockHash  Block hash to get the events from.
   */
  get: (blockHash: HexString) => Promise<Array<PalletEvent<T>>>

  /**
   * Multicast and stateful Observable watching for new events (matching the
   * event kind chosen) in the `finalized` blocks.
   */
  watch: () => Observable<{
    block: BlockInfo
    events: PalletEvent<T>[]
  }>

  /**
   * Filter a bunch of `SystemEvent` and return the decoded `payload` of every
   * of them.
   *
   * @param collection  Array of `SystemEvent` to filter.
   */
  filter: (collection: SystemEvent[]) => Array<PalletEvent<T>>
}

export const createEventEntry = <T>(
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  compatibility: ValueCompat,
): EvClient<T> => {
  const compatibilityError = () =>
    new Error(`Incompatible runtime entry Event(${pallet}.${name})`)

  const getEventsAtBlock$ = (
    hash: HexString,
    isCompatible: (dest: any) => boolean,
  ) =>
    chainHead.eventsAt$(hash).pipe(
      map((events) => {
        const winners = events.filter(
          (e) => e.event.type === pallet && e.event.value.type === name,
        )
        return winners.map((x) => {
          if (!isCompatible(x.event.value.value)) throw compatibilityError()
          return {
            original: x,
            payload: x.event.value.value,
          }
        })
      }),
    )

  const finalized$ = combineLatest([chainHead.finalized$, compatibility]).pipe(
    chainHead.withRuntime(([x]) => x.hash),
    concatMapEager(([[block, getCompat], ctx]) => {
      if (!ctx.mappedMeta.pallets[pallet]?.event.has(name))
        throw new Error(`Runtime entry Event(${pallet}.${name}) not found`)

      const { isValueCompatible } = getCompat(ctx)
      return getEventsAtBlock$(block.hash, isValueCompatible).pipe(
        map((events) => ({ block, events })),
      )
    }),
    shareLatest,
  )

  const filter: EvClient<T>["filter"] = (events) =>
    events
      .filter(({ event }) => event.type === pallet && event.value.type === name)
      .map((original) => ({
        original,
        payload: original.event.value.value,
      }))

  const get: EvClient<T>["get"] = (blockHash) =>
    firstValueFrom(
      combineLatest([
        compatibility,
        chainHead.getRuntimeContext$(blockHash),
      ]).pipe(
        take(1),
        switchMap(([getCompat, ctx]) =>
          getEventsAtBlock$(blockHash, getCompat(ctx).isValueCompatible),
        ),
      ),
    )

  return { watch: () => finalized$, get, filter }
}
