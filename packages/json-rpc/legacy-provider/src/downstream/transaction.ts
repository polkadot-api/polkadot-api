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
  const ongoing = new Map<string, Subscription>()
  const result = (rId: string, method: string, args: any[]) => {
    if (method === transactionMethods.stop) {
      const [token] = args
      ongoing.get(token)?.unsubscribe()
      ongoing.delete(token)
      reply(rId, null)
    } else if (method === transactionMethods.broadcast) {
      const token = createOpaqueToken()
      ongoing.set(
        token,
        upstream
          .obsRequest("author_submitExtrinsic", args)
          .pipe(
            // We want to make sure that we keep on retrying if there
            // are errors with the `author_submitExtrinsic` request
            catchError((_, source) => concat(timer(5_000), source)),
            // This logic ensures that the subscription dies if an
            // upstream error (like the client being destroyed) takes place
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

  result.stop = () => {
    ongoing.forEach((s) => s.unsubscribe())
    ongoing.clear()
  }

  return result
}
