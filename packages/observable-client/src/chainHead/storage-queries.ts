import {
  FollowResponse,
  StorageItemInput,
  StorageItemResponse,
} from "@polkadot-api/substrate-client"
import { Observable, mergeAll } from "rxjs"
import { getWithRecovery } from "./enhancers"

export const getRecoveralStorage$ = (
  getFollower: () => FollowResponse,
  withRecovery: ReturnType<typeof getWithRecovery>["withRecovery"],
) => {
  const recoveralStorage$ = (
    hash: string,
    queries: Array<StorageItemInput>,
    childTrie: string | null,
    isHighPriority: boolean,
  ): Observable<StorageItemResponse> =>
    new Observable<StorageItemResponse[] | Observable<StorageItemResponse>>(
      (observer) => {
        let nDiscarded = 0
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
            if (nDiscarded > 0)
              observer.next(
                recoveralStorage$(
                  hash,
                  queries.slice(-nDiscarded),
                  childTrie,
                  true,
                ),
              )
            observer.complete()
          },
          (_nDiscarded) => {
            // TODO: leave it like this b/c due to a bug on
            // PolkadotSDK sometimes this value is `undefined`
            // https://github.com/paritytech/polkadot-sdk/issues/6683
            if (_nDiscarded > 0) nDiscarded = _nDiscarded
          },
        )
      },
    ).pipe(mergeAll(), withRecovery(isHighPriority))

  return recoveralStorage$
}
