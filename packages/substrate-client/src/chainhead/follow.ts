import type { ClientRequest, ClientRequestCb } from "../client"
import type {
  FollowEventWithoutRuntime,
  FollowEventWithRuntime,
  FollowResponse,
} from "./types"
import { createBodyFn } from "./body"
import { createCallFn } from "./call"
import { createHeaderFn } from "./header"
import { createStorageFn } from "./storage"
import { createUnpinFn } from "./unpin"

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
    const _genesisHash = new Promise<string>((res) => {
      request("chainHead_unstable_genesisHash", [], res)
    })

    let unfollow: () => void = () => {}
    let followSubscription: Promise<string> | string = new Promise((res) => {
      unfollow = request(
        "chainHead_unstable_follow",
        [withRuntime],
        (result: string, follow) => {
          follow(
            (event, done) => {
              if (event.event === "stop") done()
              cb(event as any)
            },
            result,
            "chainHead_unstable_unfollow",
          )
          followSubscription = result
          res(result)
        },
      )
    })

    const fRequest = <T, TT>(
      method: string,
      params: Array<any>,
      cb: ClientRequestCb<T, TT>,
    ) => {
      const req = request as unknown as ClientRequest<T, TT>
      if (typeof followSubscription === "string")
        return req(method, [followSubscription, ...params], cb)

      let isAborted = false
      let onCancel = () => {
        isAborted = true
      }

      followSubscription.then((sub) => {
        if (isAborted) return
        onCancel = req(method, [sub, ...params], cb)
      })

      return () => {
        onCancel()
      }
    }

    return {
      genesisHash: () => _genesisHash,
      unfollow,
      body: createBodyFn(fRequest),
      call: createCallFn(fRequest),
      header: createHeaderFn(fRequest),
      storage: createStorageFn(fRequest, request),
      unpin: createUnpinFn(fRequest),
    }
  }
}
