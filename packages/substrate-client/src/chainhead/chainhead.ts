import type { UnsubscribeFn } from "@/."
import type {
  ClientRequest,
  ClientRequestCb,
  FollowSubscriptionCb,
} from "@/client"
import type { OperationEvents, Stop } from "./internal-types"
import type {
  ChainHead,
  FollowEventWithoutRuntime,
  FollowEventWithRuntime,
  FollowResponse,
} from "./public-types"
import {
  Subscriber,
  getSubscriptionsManager,
  noop,
  deferred,
} from "@/internal-utils"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"
import { DisjointError, StopError } from "./errors"

type FollowEvent =
  | FollowEventWithRuntime
  | FollowEventWithoutRuntime
  | OperationEvents
  | Stop

function isOperationEvent(event: FollowEvent): event is OperationEvents {
  return (event as OperationEvents).operationId !== undefined
}

export function getChainHead(
  request: ClientRequest<string, FollowEvent>,
): ChainHead {
  return (
    withRuntime: boolean,
    onFollowEvent:
      | ((event: FollowEventWithoutRuntime) => void)
      | ((event: FollowEventWithRuntime) => void),
    onFollowError: (e: Error) => void,
  ): FollowResponse => {
    const subscriptions = getSubscriptionsManager()

    const deferredFollow = deferred<string | Error>()
    let followSubscription: Promise<string | Error> | string | null =
      deferredFollow.promise

    const onAllFollowEventsNext = (event: FollowEvent) => {
      if (isOperationEvent(event))
        return subscriptions.next(event.operationId, event)

      if (event.event !== "stop") return onFollowEvent(event as any)

      onFollowError(new StopError())
      unfollow(false)
    }

    const onAllFollowEventsError = (error: Error) => {
      onFollowError(error)
      unfollow()
    }

    const onFollowRequestSuccess = (
      subscriptionId: string,
      follow: FollowSubscriptionCb<FollowEvent>,
    ) => {
      const done = follow(subscriptionId, {
        next: onAllFollowEventsNext,
        error: onAllFollowEventsError,
      })

      unfollow = (sendUnfollow = true) => {
        followSubscription = null
        unfollow = noop
        done()
        sendUnfollow && request("chainHead_unstable_unfollow", [subscriptionId])
        subscriptions.errorAll(new DisjointError())
      }

      followSubscription = subscriptionId
      deferredFollow.res(subscriptionId)
    }

    const onFollowRequestError = (e: Error) => {
      onFollowError(e)
      followSubscription = null
      deferredFollow.res(e)
    }

    let unfollow: (internal?: boolean) => void = request(
      "chainHead_unstable_follow",
      [withRuntime],
      { onSuccess: onFollowRequestSuccess, onError: onFollowRequestError },
    )

    const fRequest: ClientRequest<any, any> = (
      method: string,
      params: Array<any>,
      cb?: ClientRequestCb<any, any>,
    ) => {
      if (followSubscription === null) {
        cb?.onError(new DisjointError())
        return noop
      }

      const req = request as unknown as ClientRequest<any, any>

      let isAborted = false
      let onCancel = () => {
        isAborted = true
      }

      const followSubscriptionCb = (sub: string): UnsubscribeFn => {
        if (isAborted) return noop

        if (!cb) return req(method, [sub, ...params])

        const onSubscribeOperation = (
          operationId: string,
          subscriber: Subscriber<any>,
        ) => {
          if (followSubscription === null) {
            subscriber.error(new DisjointError())
            return noop
          }

          subscriptions.subscribe(operationId, subscriber)
          return () => {
            subscriptions.unsubscribe(operationId)
          }
        }

        const onSuccess = (response: string) => {
          cb.onSuccess(response, onSubscribeOperation)
        }

        return req(method, [sub, ...params], { onSuccess, onError: cb.onError })
      }

      if (typeof followSubscription === "string")
        onCancel = followSubscriptionCb(followSubscription)
      else
        followSubscription.then((s) => {
          if (s instanceof Error) {
            onCancel = noop
            cb?.onError(new DisjointError())
          } else {
            onCancel = followSubscriptionCb(s)
          }
        })

      return () => {
        onCancel()
      }
    }

    return {
      unfollow() {
        unfollow()
        followSubscription = null
      },
      body: createBodyFn(fRequest),
      call: createCallFn(fRequest),
      header: createHeaderFn(fRequest),
      storage: createStorageFn(fRequest),
      unpin: createUnpinFn(fRequest),
      _request: fRequest,
    }
  }
}
