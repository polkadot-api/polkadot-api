import type { ClientRequest } from "../client"

export const createHeaderFn =
  (request: ClientRequest<string | null, unknown>) => (hash: string) =>
    new Promise<string>((res, rej) => {
      request("chainHead_unstable_header", [hash], (response) => {
        if (typeof response == "string") return res(response)
        rej(new Error("followSubscription is Invalid"))
      })
    })
