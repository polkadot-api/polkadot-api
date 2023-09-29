import {
  ChainHead,
  FollowEventWithRuntime,
  FollowResponse,
} from "@polkadot-api/substrate-client"
import { EMPTY, Observable, catchError, noop, repeat, share } from "rxjs"

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
        observer.error(e)
      },
    )
    unfollow = () => {
      follower.unfollow()
      observer.complete()
    }
  }).pipe(
    catchError((e) => {
      console.warn("chainHead crashed")
      console.error(e)
      return EMPTY
    }),
    repeat(),
    share(),
  )

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
