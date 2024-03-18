import { ClientInnerRequest } from "./public-types"

export const createUnpinFn =
  (request: ClientInnerRequest<null, unknown>) => (hashes: string[]) =>
    hashes.length > 0
      ? new Promise<void>((res, rej) => {
          request("chainHead_unstable_unpin", [hashes], {
            onSuccess() {
              res()
            },
            onError: rej,
          })
        })
      : Promise.resolve()
