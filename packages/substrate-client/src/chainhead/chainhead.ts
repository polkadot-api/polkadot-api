import type { ClientRequest, ClientRequestCb } from "../client"
import type { OperationEvents } from "./internal-types"
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

function isOpeartionEvent(
  event: FollowEventWithRuntime | FollowEventWithoutRuntime | OperationEvents,
): event is OperationEvents {
  return (event as OperationEvents).operationId !== undefined
}

export function getChainHead(
  request: ClientRequest<
    string,
    FollowEventWithoutRuntime | FollowEventWithRuntime | OperationEvents
  >,
): ChainHead {
  return (
    withRuntime: boolean,
    cb:
      | ((event: FollowEventWithoutRuntime) => void)
      | ((event: FollowEventWithRuntime) => void),
  ): FollowResponse => {
    const subscriptions = getSubscriptionsManager()
    let unfollow: () => void = () => {}
    let firstBlockResolver: (data: string) => void
    let firstBlockRejecter: (e: any) => void

    const firstBlockPromise = new Promise<string>((res, rej) => {
      firstBlockResolver = res
      firstBlockRejecter = rej
    })

    let _cb = (e: FollowEventWithRuntime) => {
      if (e.event !== "initialized") {
        firstBlockRejecter(new Error("Missing 'initialized' event"))
      } else {
        firstBlockResolver(e.finalizedBlockHash)
      }
      _cb = cb
      cb(e)
    }

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
                _cb(event as any)
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

    const storage = createStorageFn(fRequest)

    // System::BlockHash[0] using Twox64Concat
    const SystemBlocHashAtZero =
      "0x26aa394eea5630e07c48ae0c9558cef7a44704b568d21667356a5a050c118746b4def25cfda6ef3a00000000"

    const _genesisHash = firstBlockPromise
      .then((fBlock) =>
        storage(
          fBlock,
          {
            value: [SystemBlocHashAtZero],
          },
          null,
        ),
      )
      .then((result) => result.values[SystemBlocHashAtZero])

    return {
      genesisHash: () => _genesisHash,
      unfollow() {
        unfollow()
      },
      body: createBodyFn(fRequest),
      call: createCallFn(fRequest),
      header: createHeaderFn(fRequest),
      storage,
      unpin: createUnpinFn(fRequest),
    }
  }
}
