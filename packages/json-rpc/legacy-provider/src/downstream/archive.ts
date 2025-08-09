import { createUpstream } from "@/upstream/upstream"
import { createOpaqueToken } from "@/utils/create-opaque-token"
import { finalize, map, Observable, take } from "rxjs"
import { areItemsValid, getStg$ } from "./storage"

export const archiveMethods = Object.fromEntries(
  [
    "body",
    "call",
    "finalizedHeight",
    "genesisHash",
    "hashByHeight",
    "header",
    "stopStorage",
    "storage",
  ].map((key) => [key, `archive_v1_${key}`] as const),
)

export const createArchive = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
  notification: (method: string, subscription: string, result: any) => void,
) => {
  const subscriptions = new Map<string, () => void>()
  const stg = (
    reply: (x: string) => void,
    at: string,
    items: Array<{
      key: string
      type:
        | "value"
        | "hash"
        | "descendantsValues"
        | "descendantsHashes"
        | "closestDescendantMerkleValue"
    }>,
  ) => {
    const subId = createOpaqueToken()
    reply(subId)
    const innerNotifiaction = (result: any) => {
      notification("archive_v1_storageEvent", subId, result)
    }

    const subscription = getStg$(upstream, at, items)
      .pipe(
        finalize(() => {
          subscriptions.delete(subId)
        }),
      )
      .subscribe(
        (items) => {
          items.forEach((item) =>
            innerNotifiaction({ event: "storage", ...item }),
          )
        },
        (e) => {
          console.error(e)
          innerNotifiaction({ event: "storageError", error: "" }) // TODO: figure this out
        },
        () => {
          innerNotifiaction({ event: "storageDone" })
        },
      )

    if (!subscription.closed)
      subscriptions.set(subId, () => {
        subscription.unsubscribe()
      })
  }

  return (rId: string, name: string, params: Array<any>) => {
    const innerReply = (value: any) => {
      reply(rId, value)
    }

    const obsReply = (input: Observable<any>) => {
      input.subscribe({
        next: innerReply,
        error: (e) => {
          err(rId, e.code ?? -1, e.error ?? "")
        },
      })
    }

    const [firstArg, secondArg, thirdArg] = params
    switch (name) {
      case archiveMethods.body:
        return obsReply(upstream.getBody(firstArg))
      case archiveMethods.call:
        return obsReply(
          upstream
            .runtimeCall(firstArg, secondArg, thirdArg)
            .pipe(map((value) => ({ success: true, value }))),
        )
      case archiveMethods.finalizedHeight:
        return obsReply(
          upstream.getBlocks.finalized$.pipe(
            map((x) => x.number),
            take(1),
          ),
        )
      case archiveMethods.genesisHash:
        return obsReply(upstream.genesisHash)
      case archiveMethods.hashByHeight:
        return obsReply(upstream.getBlockHash$(firstArg))
      case archiveMethods.header:
        return obsReply(upstream.getHeader(firstArg).pipe(map((h) => h.header)))
      case archiveMethods.stopStorage: {
        const sub = subscriptions.get(firstArg)
        return sub ? sub() : err(rId, -32602, "Invalid args")
      }
      case archiveMethods.storage:
        return areItemsValid(secondArg)
          ? stg(innerReply, firstArg, secondArg)
          : err(rId, -32602, "Invalid args")
    }
    throw null
  }
}
