import { concatMapEager, shareLatest } from "@/utils"
import { blockHeader } from "@polkadot-api/substrate-bindings"
import {
  ChainHead,
  FollowEventWithRuntime,
  StorageItemInput,
  StorageResult,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  ReplaySubject,
  Subject,
  distinctUntilChanged,
  from,
  map,
  merge,
  mergeMap,
  scan,
  share,
  switchMap,
  take,
} from "rxjs"

import type {
  PinnedBlock,
  BlockUsageEvent,
  RuntimeContext,
  SystemEvent,
} from "./streams"
import { getFollow$, getPinnedBlocks$ } from "./streams"
import {
  fromAbortControllerFn,
  getWithOptionalhash$,
  getWithRecovery,
  withLazyFollower,
  withOperationInaccessibleRecovery,
} from "./enhancers"
import { withDefaultValue } from "@/utils"
import { getRecoveralStorage$ } from "./storage-queries"

export type { RuntimeContext, SystemEvent }
export type { FollowEventWithRuntime }

export type BlockInfo = {
  hash: string
  number: number
  parent: string
}

const toBlockInfo = ({ hash, number, parent }: PinnedBlock): BlockInfo => ({
  hash,
  number,
  parent,
})

export const getChainHead$ = (chainHead: ChainHead) => {
  const { getFollower, unfollow, follow$ } = getFollow$(chainHead)
  const lazyFollower = withLazyFollower(getFollower)
  const { withRecovery, withRecoveryFn } = getWithRecovery()

  const blockUsage$ = new Subject<BlockUsageEvent>()
  const withRefcount =
    <A extends Array<any>, T>(
      fn: (hash: string, ...args: A) => Observable<T>,
    ): ((hash: string, ...args: A) => Observable<T>) =>
    (hash, ...args) =>
      new Observable((observer) => {
        blockUsage$.next({ type: "blockUsage", value: { type: "hold", hash } })
        const subscription = fn(hash, ...args).subscribe(observer)
        return () => {
          blockUsage$.next({
            type: "blockUsage",
            value: { type: "release", hash },
          })
          subscription.unsubscribe()
        }
      })

  const getHeader = (hash: string) =>
    getFollower().header(hash).then(blockHeader.dec)
  const unpin = (hashes: string[]) => getFollower().unpin(hashes)

  const commonEnhancer = <A extends Array<any>, T>(
    fn: (
      key: string,
      ...args: [...A, ...[abortSignal: AbortSignal]]
    ) => Promise<T>,
  ) =>
    withRefcount(
      withOperationInaccessibleRecovery(
        withRecoveryFn(fromAbortControllerFn(fn)),
      ),
    )

  const _call$ = withOperationInaccessibleRecovery(
    withRecoveryFn(fromAbortControllerFn(lazyFollower("call"))),
  )

  const cache = new Map<string, Map<string, Observable<any>>>()
  const pinnedBlocks$ = getPinnedBlocks$(
    follow$,
    getHeader,
    _call$,
    blockUsage$,
    (blocks) => {
      unpin(blocks)
      blocks.forEach((hash) => {
        cache.delete(hash)
      })
    },
  )

  const getRuntimeContext$ = (hash: string) =>
    pinnedBlocks$.pipe(
      take(1),
      mergeMap(
        (pinned) => pinned.runtimes[pinned.blocks.get(hash)!.runtime].runtime,
      ),
    )

  const withRuntime =
    <T>(mapper: (x: T) => string) =>
    (source$: Observable<T>): Observable<[T, RuntimeContext]> =>
      source$.pipe(
        concatMapEager((x) =>
          getRuntimeContext$(mapper(x)).pipe(map((runtime) => [x, runtime])),
        ),
      )

  const upsertCachedStream = <T>(
    hash: string,
    key: string,
    stream: Observable<T>,
  ): Observable<T> => {
    const cached = cache.get(hash)?.get(key)
    if (cached) return cached

    if (!cache.has(hash)) cache.set(hash, new Map())

    const result = stream.pipe(
      share({
        connector: () => new ReplaySubject<T>(),
        resetOnError: true,
        resetOnRefCountZero: true,
        resetOnComplete: false,
      }),
    )
    cache.get(hash)!.set(key, result)

    return result
  }

  const finalized$ = pinnedBlocks$.pipe(
    distinctUntilChanged((a, b) => a.finalized === b.finalized),
    map((pinned) => toBlockInfo(pinned.blocks.get(pinned.finalized)!)),
    shareLatest,
  )

  const bestBlocks$ = pinnedBlocks$.pipe(
    distinctUntilChanged(
      (prev, current) =>
        prev.finalized === current.finalized && prev.best === current.best,
    ),
    scan((acc, pinned) => {
      let current = pinned.best
      const result = new Map<string, BlockInfo>()
      while (current !== pinned.finalized) {
        const block =
          acc.get(current) || toBlockInfo(pinned.blocks.get(current)!)
        result.set(current, block)
        current = block.parent
      }
      return result
    }, new Map<string, BlockInfo>()),
    map((x) => [...x.values()]),
    shareLatest,
  )

  const runtime$ = pinnedBlocks$.pipe(
    distinctUntilChanged((a, b) => a.finalizedRuntime === b.finalizedRuntime),
    switchMap(({ finalizedRuntime: { runtime } }) =>
      runtime.pipe(withDefaultValue(null)),
    ),
    shareLatest,
  )

  const metadata$ = runtime$.pipe(map((x) => x?.metadata ?? null))

  const withOptionalHash$ = getWithOptionalhash$(
    finalized$.pipe(map((x) => x.hash)),
  )

  const _body$ = commonEnhancer(lazyFollower("body"))
  const body$ = (hash: string) => upsertCachedStream(hash, "body", _body$(hash))

  const _storage$ = commonEnhancer(lazyFollower("storage"))

  const storage$ = withOptionalHash$(
    <Type extends StorageItemInput["type"], T>(
      hash: string,
      type: Type,
      keyMapper: (ctx: RuntimeContext) => string,
      childTrie: string | null = null,
      mapper?: (data: StorageResult<Type>, ctx: RuntimeContext) => T,
    ): Observable<unknown extends T ? StorageResult<Type> : T> =>
      pinnedBlocks$.pipe(
        take(1),
        mergeMap(
          (pinned) => pinned.runtimes[pinned.blocks.get(hash)!.runtime].runtime,
        ),
        mergeMap((ctx) => {
          const key = keyMapper(ctx)
          const unMapped$ = upsertCachedStream(
            hash,
            `storage-${type}-${key}-${childTrie ?? ""}`,
            _storage$(hash, type, key, childTrie),
          )

          return mapper
            ? upsertCachedStream(
                hash,
                `storage-${type}-${key}-${childTrie ?? ""}-dec`,
                unMapped$.pipe(map((x) => mapper(x, ctx))),
              )
            : unMapped$
        }),
      ) as Observable<unknown extends T ? StorageResult<Type> : T>,
  )

  const recoveralStorage$ = getRecoveralStorage$(getFollower, withRecovery)
  const storageQueries$ = withOperationInaccessibleRecovery(
    withOptionalHash$(
      withRefcount(
        (hash: string, queries: Array<StorageItemInput>, childTrie?: string) =>
          recoveralStorage$(hash, queries, childTrie ?? null, false),
      ),
    ),
  )

  const header$ = withOptionalHash$(
    withRefcount((hash: string) => from(getHeader(hash))),
  )

  // calling `unfollow` also kills the subscription due to the fact
  // that `follow$` completes, which makes all other streams to
  // also complete (or error, in the case of ongoing operations)
  merge(runtime$, bestBlocks$).subscribe()

  const eventsAt$ = (hash: string | null) =>
    storage$(
      hash,
      "value",
      (ctx) => ctx.events.key,
      null,
      (x, ctx) => ctx.events.dec(x!),
    )

  return {
    follow$,
    finalized$,
    bestBlocks$,
    runtime$,
    metadata$,

    header$,
    body$,
    call$: withRefcount(_call$),
    storage$,
    storageQueries$,
    eventsAt$,

    withRuntime,
    getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
    unfollow,
  }
}
