import {
  DestroyedError,
  Subscriber,
  getSubscriptionsManager,
  ClientRequest,
  FollowSubscriptionCb,
} from "@polkadot-api/raw-client"
import type {
  FollowEventWithRuntimeRpc,
  FollowEventWithoutRuntimeRpc,
  OperationEventsRpc,
  StopRpc,
} from "./json-rpc-types"
import type {
  ChainHead,
  ClientInnerRequest,
  FollowEventWithoutRuntime,
  FollowEventWithRuntime,
  FollowResponse,
} from "./public-types"
import { noop, deferred } from "@/internal-utils"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"
import { DisjointError, StopError } from "./errors"
import { createStorageCb } from "./storage-subscription"
import { chainHead } from "@/methods"

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
    // If it's:
    // - a (deferred)`Promise`: it means that the susbscription is active AND that the response to the follow request has not been resolved
    // - a `string`: it means that the subscription is active and that the response to the follow request has been successful.
    // - `null`: it means that the subscription is inactive (for whatever reason: error or unsubscription)
    let followSubscription: Promise<string | Error> | string | null =
      deferredFollow.promise

    let stopListeningToFollowEvents = noop
    const unfollowRequest = (subscriptionId: string) => {
      request(chainHead.unfollow, [subscriptionId])
    }

    const stopEverything = (sendUnfollow: boolean) => {
      stopListeningToFollowEvents()
      // if it's `null` it means that everything has already been stopped
      if (followSubscription === null) return

      if (sendUnfollow) {
        if (followSubscription instanceof Promise) {
          followSubscription.then((x) => {
            if (typeof x === "string") unfollowRequest(x)
          })
        } else unfollowRequest(followSubscription)
      }
      followSubscription = null
      ongoingRequests.forEach((cb) => {
        cb()
      })
      ongoingRequests.clear()
      subscriptions.errorAll(new DisjointError())
    }

    const onAllFollowEventsNext = (event: FollowEventRpc) => {
      if (isOperationEvent(event))
        return subscriptions.next(event.operationId, event)

      switch (event.event) {
        case "stop":
          onFollowError(new StopError())
          return stopEverything(false)
        case "initialized":
        case "newBlock":
        case "bestBlockChanged":
        case "finalized":
          const { event: type, ...rest } = event
          return onFollowEvent({ type, ...rest } as any)
      }
    }

    const onAllFollowEventsError = (error: Error) => {
      onFollowError(error)
      stopEverything(!(error instanceof DestroyedError))
    }

    request(chainHead.follow, [withRuntime], {
      onSuccess: (
        subscriptionId: string,
        follow: FollowSubscriptionCb<FollowEventRpc>,
      ) => {
        // If the consumer has unsubscribed in between, then it will be `null`
        // and it should stay that way
        if (followSubscription instanceof Promise) {
          followSubscription = subscriptionId
          stopListeningToFollowEvents = follow(subscriptionId, {
            next: onAllFollowEventsNext,
            error: onAllFollowEventsError,
          })
        }
        deferredFollow.res(subscriptionId)
      },
      onError: (e: Error) => {
        followSubscription = null
        deferredFollow.res(e)
        onFollowError(e)
      },
    })

    const fRequest: ClientInnerRequest<any, any> = (method, params, cb) => {
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
        stopEverything(true)
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
