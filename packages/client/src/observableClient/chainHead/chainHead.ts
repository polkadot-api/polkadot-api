import type {
  ChainHead,
  StorageItemInput,
  StorageItemResponse,
} from "@polkadot-api/substrate-client"
import {
  getWithRecovery,
  getWithUnpinning$,
  getWithOptionalhash$,
  fromAbortControllerFn,
  withLazyFollower,
} from "./enhancers"
import { getRuntime$, getFollow$, getFinalized$, getMetadata$ } from "./streams"
import { Observable, from, mergeAll } from "rxjs"

export default (chainHead: ChainHead) => () => {
  const { getFollower, unfollow, follow$ } = getFollow$(chainHead)

  const lazyFollower = withLazyFollower(getFollower)

  const runtime$ = getRuntime$(follow$)
  const finalized$ = getFinalized$(follow$)

  const withUnpinning$ = getWithUnpinning$(
    finalized$,
    follow$,
    lazyFollower("unpin"),
  )
  const withOptionalHash$ = getWithOptionalhash$(finalized$)
  const { withRecovery, withRecoveryFn } = getWithRecovery()
  const commonEnhancer = <A extends Array<any>, T>(
    fn: (
      key: string,
      ...args: [...A, ...[abortSignal: AbortSignal]]
    ) => Promise<T>,
  ) =>
    withOptionalHash$(withUnpinning$(withRecoveryFn(fromAbortControllerFn(fn))))

  const call$ = commonEnhancer(lazyFollower("call"))
  const body$ = commonEnhancer(lazyFollower("body"))
  const storage$ = commonEnhancer(lazyFollower("storage"))

  const lazyHeader = lazyFollower("header")
  const header$ = withOptionalHash$(
    withUnpinning$((hash: string) => from(lazyHeader(hash))),
  )

  const recoveralStorage$ = (
    hash: string,
    queries: Array<StorageItemInput>,
    childTrie: string | null,
    isHighPriority: boolean,
  ): Observable<StorageItemResponse> =>
    new Observable<StorageItemResponse[] | Observable<StorageItemResponse>>(
      (observer) =>
        getFollower().storageSubscription(
          hash,
          queries,
          childTrie ?? null,
          (items) => {
            observer.next(items)
          },
          (error) => {
            observer.error(error)
          },
          () => {
            observer.complete()
          },
          (nDiscarded) => {
            observer.next(
              recoveralStorage$(
                hash,
                queries.slice(-nDiscarded),
                childTrie,
                true,
              ),
            )
          },
        ),
    ).pipe(mergeAll(), withRecovery(isHighPriority))

  const storageQueries$ = withOptionalHash$(
    withUnpinning$(
      (hash: string, queries: Array<StorageItemInput>, childTrie?: string) =>
        recoveralStorage$(hash, queries, childTrie ?? null, false),
    ),
  )

  const metadata$ = getMetadata$(call$, runtime$, finalized$)

  // calling `unfollow` also kills the subscription due to the fact
  // that `follow$` completes, which makes all other streams to
  // also complete (or error, in the case of ongoing operations)
  metadata$.subscribe()

  return {
    follow$,
    runtime$,
    metadata$,
    header$,
    body$,
    call$,
    storage$,
    storageQueries$,
    unfollow,
  }
}
