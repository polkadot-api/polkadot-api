import { Finalized } from "@polkadot-api/substrate-client"
import { Observable, filter, mergeMap } from "rxjs"
import { BlockPrunedError } from "../errors"
import { FollowEvent } from "../streams/follow"

export function withThrowWhenPrune<A extends Array<any>, T>(
  follow$: Observable<FollowEvent>,
  fn: (hash: string, ...args: A) => Observable<T>,
): (hash: string, ...args: A) => Observable<T> {
  return (hash: string, ...args: A) =>
    fn(hash, ...args).pipe(
      throwWhenPrune(
        hash,
        follow$.pipe(
          filter((evt): evt is Finalized => evt.type === "finalized"),
          mergeMap((evt) => evt.prunedBlockHashes),
        ),
      ),
    )
}

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
