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
            if (nDiscarded === 0) return

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

  return recoveralStorage$
}
