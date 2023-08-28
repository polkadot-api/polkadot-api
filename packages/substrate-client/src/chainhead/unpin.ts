import type { ClientRequest } from "../client"

export const createUnpinFn =
  (request: ClientRequest<null, unknown>) =>
  (...hashes: string[]) =>
    new Promise<void>((res, rej) => {
      request("chainHead_unstable_unpin", [hashes], {
        onSuccess() {
          res()
        },
        onError: rej,
      })
    })
