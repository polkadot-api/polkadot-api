import type { ClientRequest, ClientRequestCb } from "../client"
import type {
  FollowEventWithoutRuntime,
  FollowEventWithRuntime,
  FollowResponse,
  OperationEvents,
} from "./types"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"
import {
  Subscriber,
  getSubscriptionsManager,
} from "@/utils/subscriptions-manager"

function isOpeartionEvent(
  event: FollowEventWithRuntime | FollowEventWithoutRuntime,
): event is OperationEvents {
  return (event as OperationEvents).operationId !== undefined
}

export function follow(
  request: ClientRequest<
    string,
    FollowEventWithoutRuntime | FollowEventWithRuntime
  >,
): (
  withRuntime: true,
  cb: (event: FollowEventWithRuntime) => void,
) => FollowResponse
export function follow(
  request: ClientRequest<
    string,
    FollowEventWithoutRuntime | FollowEventWithRuntime
  >,
): (
  withRuntime: false,
  cb: (event: FollowEventWithoutRuntime) => void,
) => FollowResponse
export function follow(
  request: ClientRequest<
    string,
    FollowEventWithoutRuntime | FollowEventWithRuntime
  >,
) {
  return (
    withRuntime: boolean,
    cb:
      | ((event: FollowEventWithoutRuntime) => void)
      | ((event: FollowEventWithRuntime) => void),
  ): FollowResponse => {
    const subscriptions = getSubscriptionsManager()
    const _genesisHash = new Promise<string>((res) => {
      request("chainHead_unstable_genesisHash", [], res)
    })
    let unfollow: () => void = () => {}
    let followSubscription: Promise<string> | string = new Promise((res) => {
      unfollow = request(
        "chainHead_unstable_follow",
        [withRuntime],
        (subscriptionId, follow) => {
          const done = follow(subscriptionId, {
            next: (event) => {
              if (isOpeartionEvent(event)) {
                subscriptions.next(event.operationId, event)
              } else {
                if (event.event === "stop") {
                  done()
                  subscriptions.errorAll(new Error("disjoint"))
                }
                cb(event as any)
              }
            },
            error: (e) => {
              subscriptions.errorAll(e)
            },
          })

          unfollow = () => {
            done()
            subscriptions.errorAll(new Error("disjoint"))
            request("chainHead_unstable_unfollow", [subscriptionId])
          }

          followSubscription = subscriptionId
          res(subscriptionId)
        },
      )
    })

    const fRequest: ClientRequest<any, any> = (
      method: string,
      params: Array<any>,
      cb?: ClientRequestCb<any, any>,
    ) => {
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
            ? (response) => {
                cb(response, (id: string, subscriber: Subscriber<any>) => {
                  subscriptions.subscribe(id, subscriber)
                  return () => {
                    subscriptions.unsubscribe(id)
                  }
                })
              }
            : undefined,
        )
      }

      if (typeof followSubscription === "string")
        followSubscriptionCb(followSubscription)
      else followSubscription.then(followSubscriptionCb)

      return () => {
        onCancel()
      }
    }

    return {
      genesisHash: () => _genesisHash,
      unfollow() {
        unfollow()
      },
      body: createBodyFn(fRequest),
      call: createCallFn(fRequest),
      header: createHeaderFn(fRequest),
      storage: createStorageFn(fRequest),
      unpin: createUnpinFn(fRequest),
    }
  }
}
