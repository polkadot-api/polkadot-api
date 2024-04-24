import { chainHead } from "@/methods"
import { ClientInnerRequest } from "./public-types"

export const createHeaderFn =
  (request: ClientInnerRequest<string, unknown>) => (hash: string) =>
    new Promise<string>((res, rej) => {
      request(chainHead.header, [hash], {
        onSuccess: res,
        onError: rej,
      })
    })
