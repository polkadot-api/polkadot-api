import { createUpstream } from "../upstream/upstream"
import { createOpaqueToken } from "../utils/create-opaque-token"
import { noop } from "@polkadot-api/utils"
import { finalize } from "rxjs"
import { areItemsValid, getStg$ } from "./storage"
import { getMsgFromErr } from "../utils/message-from-error"

export const chainHeadMethods = Object.fromEntries(
  [
    "body",
    "call",
    "continue",
    "follow",
    "header",
    "stopOperation",
    "storage",
    "unfollow",
    "unpin",
  ].map((key) => [key, `chainHead_v1_${key}`] as const),
)

export const createChainHead = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
  notification: (method: string, subscription: string, result: any) => void,
) => {
  type SubCtx = {
    id: string
    up: ReturnType<typeof upstream.getBlocks>
    operations: Map<string, () => void>
    cleanUp: () => void
  }
  const subscriptions = new Map<string, SubCtx>()

  const follow = (rId: string) => {
    if (subscriptions.size === 2) {
      return err(rId, -32800, "Limit reached")
    }
    const token = createOpaqueToken()
    const up = upstream.getBlocks(token)
    const operations = new Map<string, () => void>()
    subscriptions.set(token, {
      id: token,
      up,
      operations,
      cleanUp: () => {
        cleanUp()
      },
    })
    let cleanUp = noop

    reply(rId, token)
    let subscription = up.blocks$.subscribe({
      next(v) {
        notification("chainHead_v1_followEvent", token, v)
      },
      error() {
        cleanUp()
        notification("chainHead_v1_followEvent", token, { event: "stop" })
      },
    })
    cleanUp = () => {
      cleanUp = noop
      subscription?.unsubscribe()
      subscription = null as any
      operations.forEach((cb) => {
        cb()
      })
      operations.clear()
      subscriptions.delete(token)
    }
    if (subscription.closed) cleanUp()
  }

  const unfollow = (rId: string, followId: string) => {
    subscriptions.get(followId)?.cleanUp()
    reply(rId, "null")
  }

  const stopOperation = (
    rId: string,
    followId: string,
    operationId: string,
  ) => {
    const cb = subscriptions.get(followId)?.operations.get(operationId)
    if (cb) cb()
    reply(rId, "null")
  }

  const header = (
    { up: { getHeader } }: SubCtx,
    reply: (x: any) => void,
    at: string,
  ) => {
    reply(getHeader(at))
  }

  const unpin = (
    { up: { unpin: innerUnpin } }: SubCtx,
    reply: (x: any) => void,
    hashOrHashes: string | string[],
  ) => {
    const hashes =
      typeof hashOrHashes === "string" ? [hashOrHashes] : hashOrHashes
    hashes.forEach(innerUnpin)
    reply(null)
  }

  const call = (
    { operations, id: followId }: SubCtx,
    reply: (x: any) => void,
    at: string,
    method: string,
    args: string,
  ) => {
    const operationId = createOpaqueToken()
    reply({ result: "started", operationId })
    const subscription = upstream.runtimeCall(at, method, args).subscribe(
      (output) => {
        operations.delete(operationId)
        notification("chainHead_v1_call", followId, {
          event: "operationCallDone",
          operationId,
          output,
        })
      },
      (e) => {
        operations.delete(operationId)
        notification("chainHead_v1_call", followId, {
          event: "operationError",
          operationId,
          error: getMsgFromErr(e),
        })
      },
    )
    if (!subscription.closed)
      operations.set(operationId, () => {
        subscription.unsubscribe()
        operations.delete(operationId)
      })
  }
  const body = (
    { operations, id: followId }: SubCtx,
    reply: (x: any) => void,
    at: string,
  ) => {
    const operationId = createOpaqueToken()
    reply({ result: "started", operationId })
    const subscription = upstream.getBody(at).subscribe(
      ({ block: { extrinsics: value } }) => {
        operations.delete(operationId)
        notification("chainHead_v1_body", followId, {
          event: "operationBodyDone",
          operationId,
          value,
        })
      },
      (e) => {
        operations.delete(operationId)
        notification("chainHead_v1_body", followId, {
          event: "operationError",
          operationId,
          error: getMsgFromErr(e),
        })
      },
    )

    if (!subscription.closed)
      operations.set(operationId, () => {
        subscription.unsubscribe()
        operations.delete(operationId)
      })
  }

  const stg = (
    { operations, id: followId }: SubCtx,
    reply: (x: any) => void,
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
    const operationId = createOpaqueToken()
    reply({ result: "started", operationId })
    const innerNotifiaction = (msg: any) => {
      notification("chainHead_v1_storage", followId, msg)
    }
    const subscription = getStg$(upstream, at, items)
      .pipe(
        finalize(() => {
          operations.delete(operationId)
        }),
      )
      .subscribe(
        (items) => {
          innerNotifiaction({
            event: "operationStorageItems",
            operationId,
            items,
          })
        },
        (e) => {
          innerNotifiaction({
            event: "operationError",
            operationId,
            error: getMsgFromErr(e),
          })
        },
        () => {
          innerNotifiaction({
            event: "operationStorageDone",
            operationId,
          })
        },
      )

    if (!subscription.closed)
      operations.set(operationId, () => {
        subscription.unsubscribe()
      })
  }

  const result = (rId: string, method: string, params: Array<any>) => {
    if (method === chainHeadMethods.follow) return follow(rId)
    const [followId, ...rest] = params as [string, ...any[]]
    const ctx = subscriptions.get(followId)
    if (!ctx) return err(rId, -32602, "Ivalid followSubscription")

    const innerReply = (value: any) => {
      reply(rId, value)
    }

    switch (method) {
      case chainHeadMethods.unfollow:
        return unfollow(rId, followId)
      case chainHeadMethods.stopOperation:
        return stopOperation(rId, followId, rest[0])
      case chainHeadMethods.unpin: {
        const [hashOrHashes] = rest
        if (
          (Array.isArray(hashOrHashes) ? hashOrHashes : [hashOrHashes]).some(
            (hash) => typeof hash !== "string",
          )
        )
          return err(rId, -32602, "Invalid args")
        return unpin(ctx, innerReply, hashOrHashes)
      }
      default: {
        const [at, ...other] = rest as [string, ...any[]]
        if (!ctx.up.isPinned(at)) return err(rId, -32801, "Block not pinned")

        switch (method) {
          case chainHeadMethods.header:
            return header(ctx, innerReply, at)
          case chainHeadMethods.body:
            return body(ctx, innerReply, at)
          case chainHeadMethods.call: {
            const [method, data] = other
            if (typeof method !== "string" || typeof data !== "string")
              return err(rId, -32602, "Invalid args")
            return call(ctx, innerReply, at, method, data)
          }
          case chainHeadMethods.storage: {
            const [items] = other
            return areItemsValid(items)
              ? stg(ctx, innerReply, at, items)
              : err(rId, -32602, "Invalid args")
          }
        }
      }
    }
    throw null
  }

  result.stop = () => {
    subscriptions.forEach((x) => {
      x.cleanUp()
    })
  }
  return result
}
