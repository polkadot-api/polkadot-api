import {
  Finalized,
  FollowEventWithRuntime,
} from "@polkadot-api/substrate-client"
import { Observable, filter, mergeMap, switchMap, take, throwError } from "rxjs"
import { PinnedBlocks } from "../streams"
import { isBestOrFinalizedBlock } from "../streams/block-operations"

export class BlockPrunedError extends Error {
  constructor() {
    super("Block pruned")
    this.name = "BlockPrunedError"
  }
}
export class NotBestBlockError extends Error {
  constructor() {
    super("Block is not best block or finalized")
    this.name = "NotBestBlockError"
  }
}

export function withEnsureCanonicalChain<A extends Array<any>, T>(
  blocks$: Observable<PinnedBlocks>,
  follow$: Observable<FollowEventWithRuntime>,
  fn: (hash: string, ...args: A) => Observable<T>,
) {
  return (hash: string, ...args: A) =>
    fn(hash, ...args).pipe(
      throwWhenPrune(
        hash,
        follow$.pipe(
          filter((evt): evt is Finalized => evt.type === "finalized"),
          mergeMap((evt) => evt.prunedBlockHashes),
        ),
      ),
      onlyIfIsBestOrFinalized(hash, blocks$),
    )
}

const onlyIfIsBestOrFinalized =
  <T>(hash: string, blocks$: Observable<PinnedBlocks>) =>
  (source$: Observable<T>) =>
    blocks$.pipe(
      isBestOrFinalizedBlock(hash),
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
