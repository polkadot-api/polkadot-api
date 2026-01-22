import { concatMapEager, delayUnsubscription, shareLatest } from "@/utils"
import {
  ChainHead,
  DisjointError,
  FollowEventWithRuntime,
  StorageItemInput,
  StorageResult,
} from "@polkadot-api/substrate-client"
import {
  concat,
  distinctUntilChanged,
  filter,
  identity,
  map,
  merge,
  mergeAll,
  mergeMap,
  MonoTypeOperatorFunction,
  noop,
  Observable,
  of,
  ReplaySubject,
  scan,
  share,
  shareReplay,
  Subject,
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
import {
  getFollow$,
  getPinnedBlocks$,
  PinnedBlockState,
  toBlockInfo,
} from "./streams"
import { getTrackTx } from "./track-tx"
import { getValidateTx } from "./validate-tx"

export type {
  FollowEventWithRuntime,
  PinnedBlock,
  PinnedBlocks,
  RuntimeContext,
  SystemEvent,
}

// DO NOT REMOVE JSDOCS!
// They impact top-level client
export interface BlockInfo {
  /**
   * 0x-prefixed hash of the block.
   */
  hash: string
  /**
   * Block height.
   */
  number: number
  /**
   * 0x-prefixed hash of the block parent.
   */
  parent: string
  /**
   * `true` if block carries a runtime update,
   * `false` otherwise.
   */
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
        if (e instanceof Error && e.name === DisjointError.errorName) return
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

  const _newBlocks$ = new Subject<BlockInfo | null>()
  const pinnedBlocks$ = getPinnedBlocks$(
    follow$,
    withRefcount(withRecoveryFn(fromAbortControllerFn(lazyFollower("call")))),
    getCachedMetadata,
    setCachedMetadata,
    blockUsage$,
    _newBlocks$,
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

  const readyBlocks$ = Object.assign(
    pinnedBlocks$.pipe(filter((x) => x.state.type === PinnedBlockState.Ready)),
    { state: pinnedBlocks$.state },
  )

  const finalized$ = readyBlocks$.pipe(
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

  const best$ = readyBlocks$.pipe(
    distinctUntilChanged((a, b) => a.best === b.best),
    map((pinned) => toBlockInfo(pinned.blocks.get(pinned.best)!)),
    shareLatest,
  )

  const bestBlocks$ = readyBlocks$.pipe(
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

  const runtime$ = readyBlocks$.pipe(
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
      ): Observable<{
        block: BlockInfo
        value: undefined extends M
          ? StorageResult<Type>
          : ReturnType<NonNullable<M>>
      }> => {
        const block = pinnedBlocks$.state.blocks.get(hash)!
        return pinnedBlocks$.state.runtimes[block.runtime].runtime.pipe(
          mergeMap((ctx) => {
            const key = keyMapper(ctx)
            return upsertCachedStream(
              hash,
              `storage-${type}-${key}-${childTrie ?? ""}`,
              _storage$(hash, type, key, childTrie),
            ).pipe(
              mapper ? map((raw) => mapper(raw, ctx)) : identity,
            ) as Observable<
              undefined extends M
                ? StorageResult<Type>
                : ReturnType<NonNullable<M>>
            >
          }),
          map((value) => ({ block: toBlockInfo(block), value })),
        )
      },
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
        "storageQueries",
      ),
      "storageQueries",
    ),
  )

  const header$ = withInMemory(
    withStopRecovery(pinnedBlocks$, getHeader, "header"),
    "header",
  )

  const eventsAt$ = (hash: string | null) =>
    storage$(
      hash,
      "value",
      (ctx) => ctx.events.key,
      null,
      (x, ctx) => ctx.events.dec(x!),
    ).pipe(map((v) => v.value))

  const __call$ = commonEnhancer(lazyFollower("call"), "call")
  const call$ = withOptionalHash$((hash: string, fn: string, args: string) =>
    upsertCachedStream(hash, `call-${fn}-${args}`, __call$(hash, fn, args)),
  )

  const validateTx$ = getValidateTx(call$, getRuntimeContext$)

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

      return storage$(null, "value", () => key, null).pipe(
        map((v) => v.value as HexString),
      )
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
    pinnedBlocks$.state.runtimes[codeHash]?.runtime ?? of(null)

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

  const newBlocks$ = _newBlocks$.pipe(takeWhile(Boolean))
  const trackTx$ = getTrackTx(
    readyBlocks$,
    newBlocks$,
    body$,
    validateTx$,
    eventsAt$,
    holdBlock,
  )
  const trackTxWithoutEvents$ = getTrackTx(
    pinnedBlocks$,
    newBlocks$,
    body$,
    validateTx$,
    () => of(),
    holdBlock,
  )

  return {
    follow$,
    unfollow,
    finalized$,
    best$,
    bestBlocks$,
    newBlocks$: concat(
      readyBlocks$.pipe(
        take(1),
        mergeMap(({ blocks, finalized }) => {
          const blockAndChildren = (hash: string): BlockInfo[] => {
            const block = blocks.get(hash)
            return block
              ? [block, ...Array.from(block.children).flatMap(blockAndChildren)]
              : []
          }
          return blockAndChildren(finalized)
        }),
      ),
      newBlocks$,
    ),
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
    pinnedBlocks$: readyBlocks$,
    withRuntime,
    getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
  }
}

export type ChainHead$ = ReturnType<typeof getChainHead$>
