import {
  ChainHead,
  FollowEventWithRuntime,
  FollowResponse,
} from "@polkadot-api/substrate-client"
import { Observable, noop, share } from "rxjs"

export const getFollow$ = (chainHead: ChainHead) => {
  let follower: FollowResponse
  let unfollow: () => void = noop

  const follow$ = new Observable<FollowEventWithRuntime>((observer) => {
    follower = chainHead(
      true,
      (e) => {
        observer.next(e)
      },
      (e) => {
        console.warn("chainHead crashed")
        console.error(e)
        observer.error(e)
      },
    )
    unfollow = () => {
      observer.complete()
      follower.unfollow()
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
