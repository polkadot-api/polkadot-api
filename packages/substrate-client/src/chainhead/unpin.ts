import type { UnsubscribeFn } from "../common-types"
import type { ClientRequestCb } from "../client"

export const createUnpinFn =
  (
    request: <T, TT>(
      method: string,
      params: Array<any>,
      cb: ClientRequestCb<T, TT>,
    ) => UnsubscribeFn,
  ) =>
  (...hashes: string[]) =>
    new Promise<void>((res, rej) => {
      request<string, null>(
        "chainHead_unstable_unpin",
        [hashes],
        (response) => {
          if (response == null) res()
          else rej(response)
        },
      )
    })
