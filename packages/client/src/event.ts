import {
  BlockInfo,
  ChainHead$,
  isBestOrFinalizedBlock,
} from "@polkadot-api/observable-client"
import { HexString, SizedHex } from "@polkadot-api/substrate-bindings"
import {
  Observable,
  combineLatest,
  defer,
  firstValueFrom,
  map,
  switchMap,
  take,
  filter as rFilter,
  mergeMap,
  EMPTY,
  of,
  takeUntil,
  pairwise,
  startWith,
  Subject,
  withLatestFrom,
  merge,
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

  /**
   * Observable that watches the best-block chain and emits events that describe
   * how the status changes.
   *
   * - It will emit `type: new` for new blocks in the best chain, with their
   * events. The order is consistent in increasing block number.
   * - It will emit `type: drop` for all the blocks, and their events, that
   * dropped from best-block chain after a reorg. The order is consistent in
   * increasing block number (emitting first the older blocks to be removed)
   * - It will emit `type: finalized` for all the blocks, and their events, that
   * became finalized.
   *
   * The block order is always consistent in increasing block number. And it
   * will first emit `new` events, then `drop` events, then `finalized` events.
   */
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
    const getBlockEvents$ = (blockHash: HexString) => {
      const isIrrelevant$ = isBestOrFinalizedBlock(
        chainHead.pinnedBlocks$,
        blockHash,
      ).pipe(
        rFilter((x) => x === null),
        take(1),
      )
      return combineLatest([
        compatibility,
        chainHead.getRuntimeContext$(blockHash),
      ]).pipe(
        take(1),
        switchMap(([getCompat, ctx]) => {
          if (!ctx.mappedMeta.pallets[pallet]?.event.has(name))
            throw new Error(`Runtime entry Event(${pallet}.${name}) not found`)
          return getEventsAtBlock$(blockHash, getCompat(ctx).isValueCompatible)
        }),
        takeUntil(isIrrelevant$),
      )
    }

    // In the order they were emitted
    let blocksEmitted: Array<{
      block: BlockInfo
      events: PalletEvent<T>[]
    }> = []
    const pending = new Set<HexString>()

    const newOnes = new Subject<BlockInfo>()
    const new$ = newOnes.pipe(
      concatMapEager((block) =>
        getBlockEvents$(block.hash).pipe(map((events) => ({ events, block }))),
      ),
      rFilter((x) => pending.has(x.block.hash)),
      withLatestFrom(chainHead.finalized$),
      mergeMap(([{ events, block }, finalized]) => {
        pending.delete(block.hash)
        if (finalized.number < block.number) {
          blocksEmitted.push({ block, events })
          return of({
            type: "new" as "new",
            block,
            events,
          })
        }
        return [
          {
            type: "new" as "new",
            block,
            events,
          },
          {
            type: "finalized" as "finalized",
            block,
            events,
          },
        ]
      }),
    )

    return merge(
      new$,
      chainHead.bestBlocks$.pipe(
        map((x) => x.slice(0).reverse()),
        startWith([] as BlockInfo[]),
        pairwise(),
        mergeMap(([prev, next]) => {
          if (prev.length === 0)
            return next.map((x) => ({ type: "new" as "new", block: x }))

          if (prev[0].hash !== next[0].hash) {
            const firstEmitted = blocksEmitted[0]
            if (!firstEmitted) return []
            const nFinalized = next[0]!.number - firstEmitted.block.number + 1
            const events = blocksEmitted.slice(0, nFinalized)
            blocksEmitted = blocksEmitted.slice(nFinalized)
            return events.map((e) => ({
              type: "finalized" as "finalized",
              block: e.block,
              events: e.events,
            }))
          }

          let dropped: Array<{ block: BlockInfo; events: PalletEvent<any>[] }> =
            []
          for (let i = 0; i < blocksEmitted.length; i++) {
            if (blocksEmitted[i].block.hash !== next[i + 1]?.hash) {
              dropped = blocksEmitted.slice(i)
              blocksEmitted = blocksEmitted.slice(0, i)
              break
            }
          }

          let diffIdx = prev.length
          for (let i = 0; i < prev.length; i++) {
            if (prev[i].hash !== next[i].hash) {
              diffIdx = i
              break
            }
          }
          const newOnes = next.slice(diffIdx)

          return [
            ...dropped.map((e) => ({
              type: "drop" as "drop",
              block: e.block,
              events: e.events,
            })),
            ...newOnes.map((x) => ({ type: "new" as "new", block: x })),
          ]
        }),
        mergeMap((x) => {
          if (x.type === "new") {
            pending.add(x.block.hash)
            newOnes.next(x.block)
            return EMPTY
          }
          if (x.type === "drop") {
            pending.delete(x.block.hash)
          }
          return of(x)
        }),
      ),
    )
  })

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
