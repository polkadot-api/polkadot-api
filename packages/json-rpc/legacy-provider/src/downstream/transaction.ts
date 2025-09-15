import { createUpstream } from "@/upstream/upstream"
import { createOpaqueToken } from "@/utils/create-opaque-token"
import {
  catchError,
  concat,
  ignoreElements,
  Subscription,
  takeUntil,
  timer,
} from "rxjs"

export const transactionMethods = Object.fromEntries(
  ["broadcast", "stop"].map((key) => [key, `transaction_v1_${key}`] as const),
)

export const createTransactionFns = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
) => {
  return (rId: string, method: string, args: any[]) => {
    const ongoing = new Map<string, Subscription>()
    if (method === transactionMethods.stop) {
      const [token] = args
      const sub = ongoing.get(token)
      sub?.unsubscribe()
      ongoing.delete(token)
      reply(rId, null)
    } else if (method === transactionMethods.broadcast) {
      const token = createOpaqueToken()
      ongoing.set(
        token,
        upstream
          .obsRequest("author_submitExtrinsic", args)
          .pipe(
            catchError((_, source) => concat(timer(5_000), source)),
            takeUntil(
              upstream.finalized$.pipe(
                ignoreElements(),
                catchError(() => {
                  ongoing.delete(token)
                  return [null]
                }),
              ),
            ),
          )
          .subscribe(),
      )
      reply(rId, token)
    } else {
      throw null
    }
  }
}
