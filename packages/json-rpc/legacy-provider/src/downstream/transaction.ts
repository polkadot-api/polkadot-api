import { createUpstream } from "@/upstream/upstream"

export const transactionMethods = Object.fromEntries(
  ["broadcast", "stop"].map((key) => [key, `transaction_v1_${key}`] as const),
)

export const createTransactionFns = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
) => {
  return (rId: string, method: string, args: any[]) => {
    if (method === transactionMethods.stop) {
      reply(rId, null)
    } else if (method === transactionMethods.broadcast) {
      upstream.request(
        "author_submitExtrinsic",
        args,
        (opId) => {
          reply(rId, opId)
        },
        () => {
          err(rId, -32602, "Invalid")
        },
      )
    } else {
      throw null
    }
  }
}
