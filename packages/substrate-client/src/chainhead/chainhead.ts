import type { ClientRequest, FollowSubscriptionCb } from "@/client"
import type {
  FollowEventWithRuntimeRpc,
  FollowEventWithoutRuntimeRpc,
  OperationEventsRpc,
  StopRpc,
} from "./json-rpc-types"
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
import { createStorageCb } from "./storage-subscription"

type FollowEventRpc =
  | FollowEventWithRuntimeRpc
  | FollowEventWithoutRuntimeRpc
  | OperationEventsRpc
  | StopRpc

function isOperationEvent(event: FollowEventRpc): event is OperationEventsRpc {
  return (event as OperationEventsRpc).operationId !== undefined
}

export function getChainHead(
  request: ClientRequest<string, FollowEventRpc>,
): ChainHead {
  return (
    withRuntime: boolean,
    onFollowEvent:
      | ((event: FollowEventWithoutRuntime) => void)
      | ((event: FollowEventWithRuntime) => void),
    onFollowError: (e: Error) => void,
  ): FollowResponse => {
    const subscriptions = getSubscriptionsManager<OperationEventsRpc>()

    const ongoingRequests = new Set<() => void>()
    const deferredFollow = deferred<string | Error>()
    let followSubscription: Promise<string | Error> | string | null =
      deferredFollow.promise

    const onAllFollowEventsNext = (event: FollowEventRpc) => {
      if (isOperationEvent(event))
        return subscriptions.next(event.operationId, event)

      if (event.event !== "stop") {
        const { event: type, ...rest } = event
        // This is kinda dangerous, but YOLO
        return onFollowEvent({ type, ...rest } as any)
      }

      onFollowError(new StopError())
      unfollow(false)
    }

    const onAllFollowEventsError = (error: Error) => {
      onFollowError(error)
      unfollow()
    }

    const onFollowRequestSuccess = (
      subscriptionId: string,
      follow: FollowSubscriptionCb<FollowEventRpc>,
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
        ongoingRequests.forEach((cb) => {
          cb()
        })
        ongoingRequests.clear()
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

    const fRequest: ClientRequest<any, any> = (method, params, cb) => {
      const disjoint = () => {
        cb?.onError(new DisjointError())
      }

      if (followSubscription === null) {
        disjoint()
        return noop
      }

      const onSubscription = (subscription: string) => {
        if (!cb) return request(method, [subscription, ...params])

        ongoingRequests.add(disjoint)

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

        const cleanup = request(method, [subscription, ...params], {
          onSuccess: (response) => {
            ongoingRequests.delete(disjoint)
            cb.onSuccess(response, onSubscribeOperation)
          },
          onError: (e) => {
            ongoingRequests.delete(disjoint)
            cb.onError(e)
          },
        })

        return () => {
          ongoingRequests.delete(disjoint)
          cleanup()
        }
      }

      if (typeof followSubscription === "string")
        return onSubscription(followSubscription)

      let onCancel = noop
      followSubscription.then((x) => {
        if (x instanceof Error) return disjoint()
        if (followSubscription) onCancel = onSubscription(x)
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
      storageSubscription: createStorageCb(fRequest),
      unpin: createUnpinFn(fRequest),
      _request: fRequest,
    }
  }
}
