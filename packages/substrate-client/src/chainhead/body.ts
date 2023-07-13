import { abortablePromiseFn } from "../utils/abortablePromiseFn"
import type { BodyEvent } from "./types"
import type { ClientRequestCb } from "../client"
import type { UnsubscribeFn } from "../common-types"

export const createBodyFn = (
  request: <T, TT>(
    method: string,
    params: Array<any>,
    cb: ClientRequestCb<T, TT>,
  ) => UnsubscribeFn,
) =>
  abortablePromiseFn(
    (hash: string, res: (x: Array<string>) => void, rej: (e: any) => void) =>
      request<string, BodyEvent>(
        "chainHead_unstable_body",
        [hash],
        (id, followSubscription) => {
          followSubscription(
            (e, done) => {
              done()
              if (e.event === "done") {
                res(e.value)
              } else {
                rej(new Error(e.event))
              }
            },
            id,
            "chainHead_unstable_stopBody",
          )
        },
      ),
  )
