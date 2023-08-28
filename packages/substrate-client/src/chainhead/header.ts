import type { ClientRequest } from "../client"

export const createHeaderFn =
  (request: ClientRequest<string, unknown>) => (hash: string) =>
    new Promise<string>((res, rej) => {
      request("chainHead_unstable_header", [hash], {
        onSuccess: res,
        onError: rej,
      })
    })
