import { concatMapEager, delayUnsubscription, shareLatest } from "@/utils"
import {
  ChainHead,
  DisjointError,
  FollowEventWithRuntime,
  StorageItemInput,
  StorageResult,
} from "@polkadot-api/substrate-client"
import {
  MonoTypeOperatorFunction,
  Observable,
  ReplaySubject,
  Subject,
  defer,
  distinctUntilChanged,
  map,
  merge,
  mergeMap,
  noop,
  of,
  scan,
  share,
  switchMap,
  take,
  tap,
} from "rxjs"

import { withDefaultValue } from "@/utils"
import {
  fromAbortControllerFn,
  getWithOptionalhash$,
  getWithRecovery,
  withEnsureCanonicalChain,
  withLazyFollower,
  withStopRecovery,
} from "./enhancers"
import { BlockNotPinnedError } from "./errors"
import { getRecoveralStorage$ } from "./storage-queries"
import type {
  BlockUsageEvent,
  PinnedBlocks,
  PinnedBlock,
  RuntimeContext,
  SystemEvent,
} from "./streams"
import { getFollow$, getPinnedBlocks$ } from "./streams"
import { getTrackTx } from "./track-tx"
import { getValidateTx } from "./validate-tx"

export type {
  PinnedBlocks,
  PinnedBlock,
  FollowEventWithRuntime,
  RuntimeContext,
  SystemEvent,
}

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
  const { getFollower, startFollow, follow$, getHeader } = getFollow$(chainHead)
  const lazyFollower = withLazyFollower(getFollower)
  const { withRecovery, withRecoveryFn } = getWithRecovery()

  const blockUsage$ = new Subject<BlockUsageEvent>()
  const holdBlock = (hash: string) => {
    blockUsage$.next({ type: "blockUsage", value: { type: "hold", hash } })
    return () => {
      setTimeout(() => {
        blockUsage$.next({
          type: "blockUsage",
          value: { type: "release", hash },
        })
      }, 0)
    }
  }

  const usingBlock: <T>(blockHash: string) => MonoTypeOperatorFunction<T> =
    (blockHash: string) => (base) =>
      new Observable((observer) => {
        const release = holdBlock(blockHash)
        const subscription = base.subscribe(observer)
        subscription.add(release)
        return subscription
      })

  const withRefcount =
    <A extends Array<any>, T>(
      fn: (hash: string, ...args: A) => Observable<T>,
    ): ((hash: string, ...args: A) => Observable<T>) =>
    (hash, ...args) =>
      fn(hash, ...args).pipe(usingBlock(hash))

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
  ) => {
    const canonicalChain = (_fn: (hash: string, ...args: A) => Observable<T>) =>
      withEnsureCanonicalChain(pinnedBlocks$, follow$, _fn)

    return withInMemory(
      withRefcount(
        canonicalChain(
          withStopRecovery(
            pinnedBlocks$,
            withRecoveryFn(fromAbortControllerFn(fn)),
          ),
        ),
      ),
    )
  }

  const withCanonicalChain: <Args extends Array<any>, T>(
    fn: (
      hash: string | null,
      withCanonical: boolean,
      ...args: Args
    ) => Observable<T>,
    withCanonicalChain?: boolean,
  ) => (hash: string | null, ...args: Args) => Observable<T> =
    (fn, withCanonicalChain = true) =>
    (hash, ...args) =>
      fn(hash, withCanonicalChain, ...args)

  const cache = new Map<string, Map<string, Observable<any>>>()
  const pinnedBlocks$ = getPinnedBlocks$(
    follow$,
    withRefcount(withRecoveryFn(fromAbortControllerFn(lazyFollower("call")))),
    blockUsage$,
    (blocks) => {
      unpin(blocks)
      blocks.forEach((hash) => {
        cache.delete(hash)
      })
    },
  )

  const getRuntimeContext$ = withRefcount((hash: string) =>
    pinnedBlocks$.pipe(
      take(1),
      mergeMap(
        (pinned) => pinned.runtimes[pinned.blocks.get(hash)!.runtime].runtime,
      ),
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
    const hashCache = cache.get(hash) ?? new Map()
    const cached = hashCache.get(key)
    if (cached) return cached

    cache.set(hash, hashCache)

    let connector: ReplaySubject<T>
    const result = stream.pipe(
      share({
        connector: () => (connector = new ReplaySubject()),
      }),
      tap({
        complete() {
          hashCache.set(key, connector)
        },
      }),
      delayUnsubscription(),
    )
    hashCache.set(key, result)

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
      const getBlockInfo = (hash: string) =>
        acc.get(hash) || toBlockInfo(pinned.blocks.get(hash)!)

      const best = getBlockInfo(pinned.best)
      const finalized = getBlockInfo(pinned.finalized)

      const len = best.number - finalized.number + 1
      const result = new Array<BlockInfo>(len)
      for (let i = 0, hash = best.hash; i < len; i++) {
        result[i] = getBlockInfo(hash)
        hash = result[i].parent
      }

      return new Map(result.map((b) => [b.hash, b]))
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

  const metadata$ = runtime$.pipe(map((x) => x?.lookup.metadata ?? null))

  const withOptionalHash$ = getWithOptionalhash$(
    finalized$.pipe(map((b) => b.hash)),
    best$.pipe(map((b) => b.hash)),
    usingBlock,
  )

  const _body$ = withOptionalHash$(commonEnhancer(lazyFollower("body")))
  const body$ = (hash: string) =>
    upsertCachedStream(hash, "body", _body$(hash, true))

  const _storage$ = commonEnhancer(lazyFollower("storage"))

  const storage$ = withOptionalHash$(
    <Type extends StorageItemInput["type"], T>(
      hash: string,
      withCanonicalChain: boolean,
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
            _storage$(hash, withCanonicalChain, type, key, childTrie),
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
  const storageQueries$ = withOptionalHash$(
    withStopRecovery(
      pinnedBlocks$,
      (hash: string, queries: Array<StorageItemInput>, childTrie?: string) =>
        recoveralStorage$(hash, queries, childTrie ?? null, false),
    ),
  )

  const header$ = withOptionalHash$(
    withStopRecovery(pinnedBlocks$, (hash: string) =>
      defer(() => getHeader(hash)),
    ),
  )

  const eventsAt$ = (hash: string | null, canonical = false) =>
    storage$(
      hash,
      canonical,
      "value",
      (ctx) => ctx.events.key,
      null,
      (x, ctx) => ctx.events.dec(x!),
    )

  const __call$ = commonEnhancer(lazyFollower("call"))
  const call$ = withOptionalHash$(
    (hash: string, canonical: boolean, fn: string, args: string) =>
      upsertCachedStream(
        hash,
        `call-${fn}-${args}`,
        __call$(hash, canonical, fn, args),
      ),
  )

  const validateTx$ = getValidateTx(
    withCanonicalChain(call$, false),
    getRuntimeContext$,
  )

  const innerBody$ = (hash: string) =>
    upsertCachedStream(hash, "body", _body$(hash, false))

  const trackTx$ = getTrackTx(pinnedBlocks$, innerBody$, validateTx$, eventsAt$)
  const trackTxWithoutEvents$ = getTrackTx(
    pinnedBlocks$,
    innerBody$,
    validateTx$,
    () => of(),
  )

  // calling `unfollow` also kills the subscription due to the fact
  // that `follow$` completes, which makes all other streams to
  // also complete (or error, in the case of ongoing operations)
  merge(runtime$, bestBlocks$).subscribe({
    error() {},
  })

  let unfollow = noop
  let started: boolean | null = false
  let nSubscribers: number = 0
  const start = (_nSubscribers: number) => {
    nSubscribers += _nSubscribers
    started = true

    unfollow = startFollow()
  }

  return [
    {
      follow$,
      finalized$,
      best$,
      bestBlocks$,
      runtime$,
      metadata$,

      header$,
      body$,
      call$: withCanonicalChain(call$),
      storage$: withCanonicalChain(storage$),
      storageQueries$,
      eventsAt$: withCanonicalChain(eventsAt$),

      holdBlock,
      trackTx$,
      trackTxWithoutEvents$,
      validateTx$,
      pinnedBlocks$,
      withRuntime,
      getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
      unfollow: () => {
        if (started == null) return
        nSubscribers--
        if (started && !nSubscribers) {
          started = null
          unfollow()
          unfollow = noop
        }
      },
    },
    start,
  ] as const
}

export type ChainHead$ = ReturnType<typeof getChainHead$>[0]
