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
  distinctUntilChanged,
  filter,
  identity,
  map,
  merge,
  mergeAll,
  mergeMap,
  noop,
  of,
  scan,
  share,
  shareReplay,
  switchMap,
  take,
  takeWhile,
  tap,
} from "rxjs"

import { withDefaultValue } from "@/utils"
import { HexString } from "@polkadot-api/substrate-bindings"
import {
  fromAbortControllerFn,
  getWithOptionalHash$,
  getWithRecovery,
  withLazyFollower,
  withOperationInaccessibleRetry,
  withStopRecovery,
} from "./enhancers"
import { BlockNotPinnedError } from "./errors"
import { getRecoveralStorage$ } from "./storage-queries"
import type {
  BlockUsageEvent,
  PinnedBlock,
  PinnedBlocks,
  RuntimeContext,
  SystemEvent,
} from "./streams"
import { getFollow$, getPinnedBlocks$, toBlockInfo } from "./streams"
import { getTrackTx } from "./track-tx"
import { getValidateTx } from "./validate-tx"

export type {
  FollowEventWithRuntime,
  PinnedBlock,
  PinnedBlocks,
  RuntimeContext,
  SystemEvent,
}

export type BlockInfo = {
  hash: string
  number: number
  parent: string
  hasNewRuntime: boolean
}

export const getChainHead$ = (
  chainHead: ChainHead,
  getCachedMetadata: (codeHash: string) => Observable<Uint8Array | null>,
  setCachedMetadata: (codeHash: string, metadataRaw: Uint8Array) => void,
) => {
  const { withRecovery, withRecoveryFn } = getWithRecovery()
  const { getFollower, unfollow, follow$, getHeader, hasher$ } = getFollow$(
    chainHead,
    withRecoveryFn,
  )
  const lazyFollower = withLazyFollower(getFollower)

  const blockUsage$ = new Subject<BlockUsageEvent>()

  const usingBlock: <T>(blockHash: string) => MonoTypeOperatorFunction<T> =
    (hash: string) => (base) =>
      new Observable((observer) => {
        blockUsage$.next({ type: "blockUsage", value: { type: "hold", hash } })
        const subscription = base.subscribe(observer)
        subscription.add(() => {
          setTimeout(() => {
            blockUsage$.next({
              type: "blockUsage",
              value: { type: "release", hash },
            })
          }, 0)
        })
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
      label: string,
    ): ((hash: string, ...args: A) => Observable<T>) =>
    (hash, ...args) =>
      new Observable((observer) =>
        pinnedBlocks$.state.blocks.has(hash)
          ? fn(hash, ...args).subscribe(observer)
          : observer.error(new BlockNotPinnedError(hash, label)),
      )

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
    label: string,
  ) =>
    withInMemory(
      withRefcount(
        withStopRecovery(
          pinnedBlocks$,
          withRecoveryFn(fromAbortControllerFn(fn)),
          `stop-${label}`,
        ),
      ),
      label,
    )

  const cache = new Map<string, Map<string, Observable<any>>>()

  const newBlocks$ = new Subject<BlockInfo | null>()
  const pinnedBlocks$ = getPinnedBlocks$(
    follow$,
    withRefcount(withRecoveryFn(fromAbortControllerFn(lazyFollower("call")))),
    getCachedMetadata,
    setCachedMetadata,
    blockUsage$,
    newBlocks$,
    (blocks) => {
      unpin(blocks).catch((err) => {
        console.error("unpin", err)
      })
      blocks.forEach((hash) => {
        cache.delete(hash)
      })
    },
    (block) => {
      cache.delete(block)
    },
  )

  const getRuntimeContext$ = withInMemory(
    withRefcount(
      (hash: string) =>
        pinnedBlocks$.state.runtimes[
          pinnedBlocks$.state.blocks.get(hash)!.runtime
        ].runtime,
    ),
    "getRuntimeCtx",
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
    filter((x) => !x.recovering),
    distinctUntilChanged((a, b) => a.finalized === b.finalized),
    scan((acc, value) => {
      let current = value.blocks.get(value.finalized)!
      const result = [current]

      const latest = acc.at(-1)
      if (!latest) return result

      while (current.number > latest.number + 1) {
        current = value.blocks.get(current.parent)!
        if (!current) break
        result.unshift(current)
      }
      return result
    }, [] as PinnedBlock[]),
    mergeAll(),
    map(toBlockInfo),
    shareLatest,
  )

  const best$ = pinnedBlocks$.pipe(
    distinctUntilChanged((a, b) => a.best === b.best),
    map((pinned) => toBlockInfo(pinned.blocks.get(pinned.best)!)),
    shareLatest,
  )

  const bestBlocks$ = pinnedBlocks$.pipe(
    filter((x) => !x.recovering),
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

  const withOptionalHash$ = getWithOptionalHash$(
    finalized$.pipe(map((b) => b.hash)),
    best$.pipe(map((b) => b.hash)),
    usingBlock,
  )

  const _body$ = commonEnhancer(lazyFollower("body"), "body")
  const body$ = (hash: string) =>
    withOperationInaccessibleRetry(
      upsertCachedStream(hash, "body", _body$(hash)),
    )

  const _storage$ = commonEnhancer(lazyFollower("storage"), "storage")

  const storage$ = withOptionalHash$(
    withInMemory(
      <
        Type extends StorageItemInput["type"],
        M extends
          | undefined
          | ((data: StorageResult<Type>, ctx: RuntimeContext) => any),
      >(
        hash: string,
        type: Type,
        keyMapper: (ctx: RuntimeContext) => string,
        childTrie: string | null = null,
        mapper?: M,
      ): Observable<
        undefined extends M ? StorageResult<Type> : ReturnType<NonNullable<M>>
      > =>
        pinnedBlocks$.state.runtimes[
          pinnedBlocks$.state.blocks.get(hash)!.runtime
        ].runtime.pipe(
          mergeMap((ctx) => {
            const key = keyMapper(ctx)
            return upsertCachedStream(
              hash,
              `storage-${type}-${key}-${childTrie ?? ""}`,
              _storage$(hash, type, key, childTrie),
            ).pipe(mapper ? map((raw) => mapper(raw, ctx)) : identity)
          }),
        ) as Observable<
          undefined extends M ? StorageResult<Type> : ReturnType<NonNullable<M>>
        >,
      "storage",
    ),
  )

  const recoveralStorage$ = getRecoveralStorage$(getFollower, withRecovery)
  const storageQueries$ = withOptionalHash$(
    withInMemory(
      withStopRecovery(
        pinnedBlocks$,
        (hash: string, queries: Array<StorageItemInput>, childTrie?: string) =>
          recoveralStorage$(hash, queries, childTrie ?? null, false),
        `storageQueries`,
      ),
      "storageQueries",
    ),
  )

  const header$ = withOptionalHash$(
    withInMemory(
      withStopRecovery(pinnedBlocks$, getHeader, "header"),
      "header",
    ),
  )

  const eventsAt$ = (hash: string | null) =>
    storage$(
      hash,
      "value",
      (ctx) => ctx.events.key,
      null,
      (x, ctx) => ctx.events.dec(x!),
    )

  const __call$ = commonEnhancer(lazyFollower("call"), "call")
  const call$ = withOptionalHash$((hash: string, fn: string, args: string) =>
    upsertCachedStream(hash, `call-${fn}-${args}`, __call$(hash, fn, args)),
  )

  const validateTx$ = getValidateTx(call$, getRuntimeContext$)

  const innerBody$ = (hash: string) =>
    upsertCachedStream(hash, "body", _body$(hash))

  const trackTx$ = getTrackTx(pinnedBlocks$, innerBody$, validateTx$, eventsAt$)
  const trackTxWithoutEvents$ = getTrackTx(
    pinnedBlocks$,
    innerBody$,
    validateTx$,
    () => of(),
  )

  const genesis$ = runtime$.pipe(
    filter(Boolean),
    take(1),
    mergeMap((runtime) => {
      const { enc } = runtime.dynamicBuilder.buildStorage(
        "System",
        "BlockHash",
      ).keys
      // const genesis$ =
      // there are chains (e.g. kilt) that use u64 as block number
      // u64 is encoded as bigint
      // using dynamic builder for safety
      let key: string
      try {
        // for u32
        key = enc(0)
      } catch {
        // for u64
        key = enc(0n)
      }

      return storage$(null, "value", () => key, null) as Observable<HexString>
    }),
    shareReplay(1),
  )
  // calling `unfollow` also kills the subscription due to the fact
  // that `follow$` completes, which makes all other streams to
  // also complete (or error, in the case of ongoing operations)
  merge(runtime$, bestBlocks$).subscribe({
    error() {},
  })

  const getRuntime$ = (codeHash: string): Observable<RuntimeContext | null> =>
    pinnedBlocks$.state.runtimes[codeHash].runtime ?? of(null)

  const holdBlock = (blockHash: string | null, shouldThrow = false) => {
    let hash = blockHash || "finalized"
    hash = pinnedBlocks$.state[hash as "best" | "finalized"] || hash

    if (!pinnedBlocks$.state.blocks.has(hash)) {
      if (shouldThrow) throw new BlockNotPinnedError(hash, "holdBlock")
      return noop
    }

    blockUsage$.next({
      type: "blockUsage",
      value: {
        type: "hold",
        hash,
      },
    })

    let tearDown = () => {
      blockUsage$.next({
        type: "blockUsage",
        value: {
          type: "release",
          hash,
        },
      })
      tearDown = noop
    }
    return () => {
      tearDown()
    }
  }

  const withHodl =
    (blockHash: string | null) =>
    <T>(base: Observable<T>) =>
      new Observable<T>((observer) => {
        const subscription = base.subscribe(observer)
        if (!subscription.closed) subscription.add(holdBlock(blockHash))
        return subscription
      })

  return {
    follow$,
    unfollow,
    finalized$,
    best$,
    bestBlocks$,
    newBlocks$: newBlocks$.pipe(takeWhile(Boolean)),
    runtime$,
    metadata$,
    genesis$,
    hasher$,
    getRuntime$,

    header$,
    body$,
    call$,
    storage$,
    storageQueries$,
    eventsAt$,

    withHodl,
    holdBlock,
    trackTx$,
    trackTxWithoutEvents$,
    validateTx$,
    pinnedBlocks$,
    withRuntime,
    getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
  }
}

export type ChainHead$ = ReturnType<typeof getChainHead$>
