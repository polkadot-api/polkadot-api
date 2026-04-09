import { BlockInfo, ChainHead$ } from "@polkadot-api/observable-client"
import { HexString, SizedHex } from "@polkadot-api/substrate-bindings"
import {
  Observable,
  combineLatest,
  concat,
  defer,
  firstValueFrom,
  from,
  map,
  switchMap,
  take,
  tap,
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
  topics: Array<SizedHex<32>>
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

  watchBest: () => Observable<{
    type: "new" | "drop" | "finalized"
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

  const best$ = defer(() => {
    // In the order they were emitted
    let blocksEmitted: Array<{
      block: BlockInfo
      events: PalletEvent<T>[]
    }> = []

    const getBlockEvents$ = (blockHash: HexString) =>
      combineLatest([
        compatibility,
        chainHead.getRuntimeContext$(blockHash),
      ]).pipe(
        take(1),
        switchMap(([getCompat, ctx]) => {
          if (!ctx.mappedMeta.pallets[pallet]?.event.has(name))
            throw new Error(`Runtime entry Event(${pallet}.${name}) not found`)
          return getEventsAtBlock$(blockHash, getCompat(ctx).isValueCompatible)
        }),
      )

    return chainHead.bestBlocks$.pipe(
      switchMap((bestBlockChain) => {
        const finalizedBlock = bestBlockChain.at(-1)!
        const bestBlocks = bestBlockChain.slice(0, -1)
        const bestBlockSet = new Set(bestBlocks.map((b) => b.hash))

        // Only emit drop/finalized for blocks we actually delivered to the subscriber
        const removed = blocksEmitted.filter(
          ({ block }) => !bestBlockSet.has(block.hash),
        )
        // Blocks that disappeared due to being finalized.
        // Assumption: `best` is always updated before `finalized`. Otherwise it
        // could end up with missing blocks
        const finalized = removed.filter(
          ({ block }) => block.number <= finalizedBlock.number,
        )
        // Blocks that disappeared due to a reorg.
        const drops = removed.filter(
          ({ block }) => block.number > finalizedBlock.number,
        )
        const removed$ = from([
          ...finalized.map((action) => ({
            ...action,
            type: "finalized" as const,
          })),
          ...drops
            .reverse()
            .map((action) => ({ ...action, type: "drop" as const })),
        ])

        blocksEmitted = blocksEmitted.filter(({ block }) =>
          bestBlockSet.has(block.hash),
        )
        const emittedSet = new Set(blocksEmitted.map(({ block }) => block.hash))
        const toLoad = bestBlocks.filter((b) => !emittedSet.has(b.hash))

        const new$ = from(toLoad.reverse()).pipe(
          concatMapEager((block) =>
            getBlockEvents$(block.hash).pipe(
              map((events) => ({ type: "new" as const, block, events })),
            ),
          ),
          tap(({ block, events }) => blocksEmitted.push({ block, events })),
        )

        return concat(removed$, new$)
      }),
    )
  }).pipe(shareLatest)

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

  return { watch: () => finalized$, watchBest: () => best$, get, filter }
}
