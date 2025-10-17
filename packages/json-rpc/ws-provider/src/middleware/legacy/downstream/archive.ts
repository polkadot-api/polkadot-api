import { finalize, map, Observable, Subscription, take } from "rxjs"
import { createUpstream } from "../upstream/upstream"
import { createOpaqueToken } from "../utils/create-opaque-token"
import { areItemsValid, getStg$ } from "./storage"
import { getMsgFromErr } from "../utils/message-from-error"
import { archive } from "../../methods"

const {
  body,
  call,
  finalizedHeight,
  genesisHash,
  hashByHeight,
  header,
  stopStorage,
  storage,
} = archive

export const createArchive = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
  notification: (method: string, subscription: string, result: any) => void,
) => {
  const stgSubscriptions = new Map<string, Subscription>()

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
          stgSubscriptions.delete(subId)
        }),
      )
      .subscribe(
        (items) => {
          items.forEach((item) =>
            innerNotifiaction({ event: "storage", ...item }),
          )
        },
        (e) => {
          innerNotifiaction({ event: "storageError", error: getMsgFromErr(e) })
        },
        () => {
          innerNotifiaction({ event: "storageDone" })
        },
      )

    if (!subscription.closed) stgSubscriptions.set(subId, subscription)
  }

  const result = (rId: string, name: string, params: Array<any>) => {
    const innerReply = (value: any) => {
      reply(rId, value)
    }

    const obsReply = (input: Observable<any>) => {
      // There is no need to keep these subscriptions around
      // b/c killing upstream will also kill this subscription
      input.subscribe({
        next: innerReply,
        error: (e) => {
          err(rId, e.code ?? -1, getMsgFromErr(e))
        },
      })
    }

    const [firstArg, secondArg, thirdArg] = params
    switch (name) {
      case body:
        return obsReply(upstream.getBody(firstArg))
      case call:
        return obsReply(
          upstream
            .runtimeCall(firstArg, secondArg, thirdArg)
            .pipe(map((value) => ({ success: true, value }))),
        )
      case finalizedHeight:
        return obsReply(
          upstream.finalized$.pipe(
            map((x) => x.number),
            take(1),
          ),
        )
      case genesisHash:
        return obsReply(upstream.genesisHash)
      case hashByHeight:
        return obsReply(upstream.getBlockHash$(firstArg))
      case header:
        return obsReply(
          upstream.getHeader$(firstArg).pipe(map((h) => h.header)),
        )
      case stopStorage: {
        const sub = stgSubscriptions.get(firstArg)
        return sub ? sub.unsubscribe() : err(rId, -32602, "Invalid args")
      }
      case storage:
        return areItemsValid(secondArg)
          ? stg(innerReply, firstArg, secondArg)
          : err(rId, -32602, "Invalid args")
    }
    throw null
  }

  result.stop = () => {
    ;[...stgSubscriptions].forEach(([, s]) => s.unsubscribe())
    stgSubscriptions.clear()
  }

  return result
}
