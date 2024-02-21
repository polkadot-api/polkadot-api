import type { ClientRequest, FollowSubscriptionCb } from "@/client"
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
import {
  Subscriber,
  getSubscriptionsManager,
  noop,
  deferred,
  OrphanMessages,
} from "@/internal-utils"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"
import { DisjointError, StopError } from "./errors"
import { createStorageCb } from "./storage-subscription"
import { DestroyedError } from "@/client/DestroyedError"

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
    const orphans = new OrphanMessages<OperationEventsRpc>()

    const ongoingRequests = new Set<() => void>()
    const deferredFollow = deferred<string | Error>()
    let followSubscription: Promise<string | Error> | string | null =
      deferredFollow.promise

    const onAllFollowEventsNext = (event: FollowEventRpc) => {
      if (isOperationEvent(event)) {
        if (!subscriptions.has(event.operationId)) {
          orphans.set(event.operationId, event)
          console.debug(
            `*Unknown operationId(${
              event.operationId
            }) seen on message: \n${JSON.stringify(event)}\n`,
          )
        }
        return subscriptions.next(event.operationId, event)
      }

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
      unfollow(!(error instanceof DestroyedError))
    }

    const onFollowRequestSuccess = (
      subscriptionId: string,
      follow: FollowSubscriptionCb<FollowEventRpc>,
    ) => {
      const done = follow("chainHead_unstable_followEvent", subscriptionId, {
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
        orphans.clear()
      }

      followSubscription = subscriptionId
      deferredFollow.res(subscriptionId)
    }

    const onFollowRequestError = (e: Error) => {
      if (e instanceof DestroyedError) {
        unfollow(false)
      } else {
        onFollowError(e)
      }
      followSubscription = null
      deferredFollow.res(e)
    }

    let unfollow: (internal?: boolean) => void = request(
      "chainHead_unstable_follow",
      [withRuntime],
      { onSuccess: onFollowRequestSuccess, onError: onFollowRequestError },
    )

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

          const pending = orphans.retrieve(operationId)
          pending.forEach((msg) => {
            subscriptions.next(operationId, msg)
          })

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
