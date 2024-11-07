import { BlockHeader, blockHeader } from "@polkadot-api/substrate-bindings"
import {
  ChainHead,
  FollowEventWithRuntime,
  FollowResponse,
  StopError,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  ObservedValueOf,
  Subscription,
  concatMap,
  connectable,
  noop,
  of,
} from "rxjs"

const withInitializedNumber =
  (getHeader: (hash: string) => Promise<BlockHeader>) =>
  (source$: Observable<FollowEventWithRuntime>) =>
    source$.pipe(
      concatMap((event) => {
        return event.type !== "initialized"
          ? of(event)
          : getHeader(event.finalizedBlockHashes[0]).then((header) => ({
              ...event,
              number: header.number,
              parentHash: header.parentHash,
            }))
      }),
    )

export const getFollow$ = (chainHead: ChainHead) => {
  let follower: FollowResponse | null = null
  let unfollow: () => void = noop

  const getFollower = () => {
    if (!follower) throw new Error("Missing chainHead subscription")
    return follower
  }

  const getHeader = (hash: string) =>
    getFollower().header(hash).then(blockHeader.dec)

  const follow$ = connectable(
    new Observable<FollowEventWithRuntime>((observer) => {
      follower = chainHead(
        true,
        (e) => {
          observer.next(e)
        },
        (e) => {
          follower = null
          observer.error(e)
        },
      )
      unfollow = () => {
        observer.complete()
        follower?.unfollow()
      }
    }).pipe(withInitializedNumber(getHeader), retryOnStopError()),
  )

  const startFollow = () => {
    follow$.connect()
    return () => {
      unfollow()
    }
  }

  return {
    getHeader,
    getFollower,
    startFollow,
    follow$,
  }
}

const retryOnStopError =
  <T extends { type: string }>() =>
  (source$: Observable<T>) =>
    new Observable<
      | T
      | {
          type: "stop-error"
        }
    >((observer) => {
      const subscription = new Subscription()
      const subscribe = () =>
        source$.subscribe({
          next: (v) => observer.next(v),
          error: (e) => {
            if (e instanceof StopError) {
              observer.next({ type: "stop-error" })
              subscription.add(subscribe())
            } else {
              observer.error(e)
            }
          },
          complete: () => observer.complete(),
        })
      subscription.add(subscribe())
      return subscription
    })

export type FollowEvent =
  | ObservedValueOf<ReturnType<ReturnType<typeof withInitializedNumber>>>
  | { type: "stop-error" }
