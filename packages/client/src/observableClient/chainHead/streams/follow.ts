import {
  ChainHead,
  FollowEventWithRuntime,
  FollowResponse,
  StopError,
} from "@polkadot-api/substrate-client"
import { Observable, Subscription, noop, share } from "rxjs"

export const getFollow$ = (chainHead: ChainHead) => {
  let follower: FollowResponse | null = null
  let unfollow: () => void = noop

  const follow$ = new Observable<FollowEventWithRuntime>((observer) => {
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
  }).pipe(share())

  return {
    getFollower: () => {
      if (!follower) throw new Error("Missing chainHead subscription")
      return follower
    },
    unfollow: () => {
      unfollow()
    },
    follow$,
  }
}

export const retryOnStopError =
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
