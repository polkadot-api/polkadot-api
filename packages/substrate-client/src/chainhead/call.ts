import { abortablePromiseFn } from "../utils/abortablePromiseFn"
import type { ClientRequestCb } from "../client"
import type { UnsubscribeFn } from "../common-types"
import type { CallEvent } from "./types"

export const createCallFn = (
  request: <T, TT>(
    method: string,
    params: Array<any>,
    cb: ClientRequestCb<T, TT>,
  ) => UnsubscribeFn,
) =>
  abortablePromiseFn(
    (
      hash: string,
      fnName: string,
      callParameters: string,
      res: (output: string) => void,
      rej: (e: any) => void,
    ) =>
      request<string, CallEvent>(
        "chainHead_unstable_call",
        [hash, fnName, callParameters],
        (id, followSubscription) => {
          followSubscription(
            (e, done) => {
              done()
              if (e.event === "done") return res(e.output)
              rej(new Error(e.event === "error" ? e.error : e.event))
            },
            id,
            "chainHead_unstable_stopCall",
          )
        },
      ),
  )
