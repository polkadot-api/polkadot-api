import { concatMapEager, shareLatest } from "@/utils"
import { blockHeader } from "@polkadot-api/substrate-bindings"
import {
  ChainHead,
  DisjointError,
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
  withEnsureCanonicalChain,
  withStopRecovery,
} from "./enhancers"
import { withDefaultValue } from "@/utils"
import { getRecoveralStorage$ } from "./storage-queries"
import { getTrackTx } from "./track-tx"
import { BlockNotPinnedError } from "./errors"

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
          setTimeout(() => {
            blockUsage$.next({
              type: "blockUsage",
              value: { type: "release", hash },
            })
          }, 0)
          subscription.unsubscribe()
        }
      })

  const withInMemory =
    <A extends Array<any>, T>(
      fn: (hash: string, ...args: A) => Observable<T>,
    ): ((hash: string, ...args: A) => Observable<T>) =>
    (hash, ...args) =>
      new Observable((observer) => {
        let isPresent = false
        pinnedBlocks$.pipe(take(1)).subscribe((blocks) => {
          const block = blocks.blocks.get(hash)
          isPresent = !!block && !block.unpinned
        })

        return isPresent
          ? fn(hash, ...args).subscribe(observer)
          : observer.error(new BlockNotPinnedError())
      })

  const getHeader = (hash: string) =>
    getFollower().header(hash).then(blockHeader.dec)

  const unpin = (hashes: string[]) =>
    getFollower()
      .unpin(hashes)
      .catch((e) => {
        if (e instanceof DisjointError) return
        throw e
      })

  const commonEnhancer = <A extends Array<any>, T>(
    fn: (
      key: string,
      ...args: [...A, ...[abortSignal: AbortSignal]]
    ) => Promise<T>,
  ) =>
    withInMemory(
      withRefcount(
        withEnsureCanonicalChain(
          pinnedBlocks$,
          follow$,
          withStopRecovery(
            pinnedBlocks$,
            withOperationInaccessibleRecovery(
              withRecoveryFn(fromAbortControllerFn(fn)),
            ),
          ),
        ),
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

  const best$ = pinnedBlocks$.pipe(
    distinctUntilChanged((a, b) => a.best === b.best),
    map((pinned) => toBlockInfo(pinned.blocks.get(pinned.best)!)),
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
    finalized$.pipe(map((b) => b.hash)),
    best$.pipe(map((b) => b.hash)),
  )

  const _body$ = commonEnhancer(lazyFollower("body"))
  const body$ = (hash: string) => upsertCachedStream(hash, "body", _body$(hash))
  const trackTx$ = getTrackTx(pinnedBlocks$, body$)

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
    best$,
    bestBlocks$,
    runtime$,
    metadata$,

    header$,
    body$,
    call$: withOptionalHash$(withRefcount(_call$)),
    storage$,
    storageQueries$,
    eventsAt$,

    trackTx$,
    withRuntime,
    getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
    unfollow,
  }
}
