import {
  Finalized,
  FollowEventWithRuntime,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  filter,
  mergeMap,
  pipe,
  switchMap,
  take,
  throwError,
} from "rxjs"
import { BlockPrunedError, NotBestBlockError } from "../errors"
import { PinnedBlocks, retryOnStopError } from "../streams"
import { isBestOrFinalizedBlock } from "../streams/block-operations"

export function withEnsureCanonicalChain<A extends Array<any>, T>(
  blocks$: Observable<PinnedBlocks>,
  follow$: Observable<FollowEventWithRuntime>,
  fn: (hash: string, ...args: A) => Observable<T>,
): (hash: string, ensureCanonical: boolean, ...args: A) => Observable<T> {
  return (hash: string, ensureCanonical, ...args: A) => {
    const enhancer: <T>(x: Observable<T>) => Observable<T> = ensureCanonical
      ? pipe(
          throwWhenPrune(
            hash,
            follow$.pipe(
              retryOnStopError(),
              filter((evt): evt is Finalized => evt.type === "finalized"),
              mergeMap((evt) => evt.prunedBlockHashes),
            ),
          ),
          onlyIfIsBestOrFinalized(hash, blocks$),
        )
      : (x) => x

    return enhancer(fn(hash, ...args))
  }
}

const onlyIfIsBestOrFinalized =
  <T>(hash: string, blocks$: Observable<PinnedBlocks>) =>
  (source$: Observable<T>) =>
    isBestOrFinalizedBlock(blocks$, hash).pipe(
      take(1),
      switchMap((isBest) =>
        isBest ? source$ : throwError(() => new NotBestBlockError()),
      ),
    )

const throwWhenPrune =
  <T>(hash: string, pruned$: Observable<string>) =>
  (source$: Observable<T>) =>
    new Observable<T>((subscriber) => {
      const prunedSubscription = pruned$
        .pipe(filter((h) => h === hash))
        .subscribe(() => {
          subscriber.error(new BlockPrunedError())
        })
      const sourceSubscription = source$.subscribe(subscriber)

      return () => {
        prunedSubscription.unsubscribe()
        sourceSubscription.unsubscribe()
      }
    })
