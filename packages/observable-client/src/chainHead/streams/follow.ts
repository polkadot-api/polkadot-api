import { BlockHeader, blockHeader } from "@polkadot-api/substrate-bindings"
import {
  BestBlockChanged,
  ChainHead,
  Finalized,
  FollowEventWithRuntime,
  FollowResponse,
  Initialized,
  NewBlockWithRuntime,
  StopError,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  ObservedValueOf,
  Subscription,
  connectable,
  noop,
} from "rxjs"

type EnhancedFollowEventWithRuntime =
  | (Initialized & {
      number: number
      parentHash: string
    })
  | NewBlockWithRuntime
  | BestBlockChanged
  | Finalized

const withInitializedNumber =
  (getHeader: (hash: string) => Promise<BlockHeader>) =>
  (source$: Observable<FollowEventWithRuntime>) =>
    new Observable<EnhancedFollowEventWithRuntime>((observer) => {
      let pending: Array<EnhancedFollowEventWithRuntime> | null = null
      return source$.subscribe({
        next(event) {
          if (event.type === "initialized") {
            pending = []
            getHeader(event.finalizedBlockHashes[0])
              .then((header) => {
                if (!observer.closed) {
                  observer.next({
                    ...event,
                    number: header.number,
                    parentHash: header.parentHash,
                  })
                  pending!.forEach((e) => {
                    observer.next(e)
                  })
                  pending = null
                }
              })
              .catch((e) => {
                if (!observer.closed) observer.error(e)
              })
          } else if (pending) pending.push(event)
          else observer.next(event)
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })
    })

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
    }).pipe(withInitializedNumber(getHeader), retryChainHeadError()),
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

const retryChainHeadError =
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
            subscription.add(subscribe())
            if (e instanceof StopError) {
              observer.next({ type: "stop-error" })
            } else {
              console.warn("ChainHead follow request failed, retrying…", e)
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
