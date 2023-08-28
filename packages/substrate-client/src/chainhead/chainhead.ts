import type { ClientRequest, ClientRequestCb } from "../client"
import type { OperationEvents, Stop } from "./internal-types"
import type {
  ChainHead,
  FollowEventWithoutRuntime,
  FollowEventWithRuntime,
  FollowResponse,
} from "./public-types"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"
import {
  Subscriber,
  getSubscriptionsManager,
} from "@/utils/subscriptions-manager"
import { noop } from "@/utils/noop"
import { ErrorDisjoint, ErrorStop } from "./errors"

function isOperationEvent(
  event:
    | FollowEventWithRuntime
    | FollowEventWithoutRuntime
    | OperationEvents
    | Stop,
): event is OperationEvents {
  return (event as OperationEvents).operationId !== undefined
}

export function getChainHead(
  request: ClientRequest<
    string,
    FollowEventWithoutRuntime | FollowEventWithRuntime | OperationEvents | Stop
  >,
): ChainHead {
  return (
    withRuntime: boolean,
    onSuccess:
      | ((event: FollowEventWithoutRuntime) => void)
      | ((event: FollowEventWithRuntime) => void),
    onError: (e: Error) => void,
  ): FollowResponse => {
    const subscriptions = getSubscriptionsManager()
    let unfollow: () => void = () => {}

    let followSubscription: Promise<string | Error> | string | Error =
      new Promise((res) => {
        unfollow = request("chainHead_unstable_follow", [withRuntime], {
          onSuccess: (subscriptionId, follow) => {
            const done = follow(subscriptionId, {
              next: (event) => {
                if (isOperationEvent(event)) {
                  subscriptions.next(event.operationId, event)
                } else {
                  if (event.event === "stop") {
                    onError(new ErrorStop())
                    sendUnfollow = false
                    unfollow()
                  } else onSuccess(event as any)
                }
              },
              error: (e) => {
                onError(e)
                unfollow()
              },
            })

            let sendUnfollow = true
            unfollow = () => {
              unfollow = noop
              done()
              sendUnfollow &&
                request("chainHead_unstable_unfollow", [subscriptionId])
              subscriptions.errorAll(new ErrorDisjoint())
            }

            followSubscription = subscriptionId
            res(subscriptionId)
          },
          onError(e) {
            onError(e)
            followSubscription = e
            res(e)
          },
        })
      })

    const fRequest: ClientRequest<any, any> = (
      method: string,
      params: Array<any>,
      cb?: ClientRequestCb<any, any>,
    ) => {
      if (followSubscription instanceof Error) {
        cb?.onError(new ErrorDisjoint())
        return noop
      }

      const req = request as unknown as ClientRequest<any, any>

      let isAborted = false
      let onCancel = () => {
        isAborted = true
      }

      const followSubscriptionCb = (sub: string) => {
        if (isAborted) return

        onCancel = req(
          method,
          [sub, ...params],
          cb
            ? {
                onSuccess: (response) => {
                  cb.onSuccess(
                    response,
                    (id: string, subscriber: Subscriber<any>) => {
                      subscriptions.subscribe(id, subscriber)
                      return () => {
                        subscriptions.unsubscribe(id)
                      }
                    },
                  )
                },
                onError: cb.onError,
              }
            : undefined,
        )
      }

      if (typeof followSubscription === "string")
        followSubscriptionCb(followSubscription)
      else
        followSubscription.then((s) => {
          if (s instanceof Error) {
            onCancel = noop
            cb?.onError(new ErrorDisjoint())
          } else followSubscriptionCb(s)
        })

      return () => {
        onCancel()
      }
    }

    return {
      unfollow() {
        unfollow()
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
