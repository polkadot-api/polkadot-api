import { createUpstream } from "@/upstream/upstream"
import { createOpaqueToken } from "@/utils/create-opaque-token"
import { Subscription } from "rxjs"

export const createTransactionFns = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
) => {
  const onGoing = new Map<string, Subscription>()
  return (rId: string, name: "broadcast" | "stop", args: any[]) => {
    if (name === "stop") {
      const [key] = args
      const subscription = onGoing.get(key)
      subscription?.unsubscribe()
      onGoing.delete(key)
      reply(rId, null)
    } else if (name === "broadcast") {
      const opId = createOpaqueToken()
      upstream.request(
        "author_submitExtrinsic",
        args,
        () => {
          reply(rId, opId)
        },
        () => {
          err(rId, -32602, "Invalid")
        },
      )
    } else err(rId, -32602, "Invalid")
  }
}
