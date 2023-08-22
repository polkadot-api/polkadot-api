import type { ClientRequest } from "../client"

export const createUnpinFn =
  (request: ClientRequest<string, null>) =>
  (...hashes: string[]) =>
    new Promise<void>((res, rej) => {
      request("chainHead_unstable_unpin", [hashes], (response) => {
        if (response == null) res()
        else rej(response)
      })
    })
