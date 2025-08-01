import { createUpstream } from "@/upstream/upstream"
import { createOpaqueToken } from "@/utils/create-opaque-token"
import { noop } from "@polkadot-api/utils"
import { filter, map, merge } from "rxjs"

const validStorageTypes = new Set([
  "value",
  "hash",
  "closestDescendantMerkleValue",
  "descendantsValues",
  "descendantsHashes",
])

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
      error(e) {
        console.error(e)
        cleanUp()
        // TODO: fix this shit
        // notification("chainHead_v1_followEvent", token, { event: "stop" })
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
        console.error(e)
        notification("chainHead_v1_call", followId, {
          event: "operationError",
          operationId,
          error: "", // TODO: figure this out
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
        console.error(e)
        notification("chainHead_v1_body", followId, {
          event: "operationError",
          operationId,
          error: "", // TODO: figure this out
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

    const subscription = merge(
      ...items.map(({ key, type }) => {
        switch (type) {
          case "value":
            return upstream.stgValue(at, key).pipe(
              filter(Boolean),
              map((value) => [
                {
                  key,
                  value,
                },
              ]),
            )
          case "hash":
            return upstream.stgHash(at, key).pipe(
              filter(Boolean),
              map((hash) => [
                {
                  key,
                  hash,
                },
              ]),
            )
          case "descendantsValues":
            return upstream
              .stgDescendantValues(at, key)
              .pipe(
                map((values) => values.map(([key, value]) => ({ key, value }))),
              )

          case "descendantsHashes":
            return upstream
              .stgDescendantHashes(at, key)
              .pipe(
                map((values) => values.map(([key, hash]) => ({ key, hash }))),
              )

          case "closestDescendantMerkleValue":
            return upstream.stgClosestDescendant(at, key).pipe(
              filter(Boolean),
              map((closestDescendantMerkleValue) => [
                {
                  key,
                  closestDescendantMerkleValue,
                },
              ]),
            )
        }
      }),
    ).subscribe(
      (items) => {
        notification("chainHead_v1_storage", followId, {
          event: "operationStorageItems",
          operationId,
          items,
        })
      },
      (e) => {
        operations.delete(operationId)
        console.error(e)
        notification("chainHead_v1_storage", followId, {
          event: "operationError",
          operationId,
          error: "", // TODO: figure this out
        })
      },
      () => {
        notification("chainHead_v1_storage", followId, {
          event: "operationStorageDone",
          operationId,
        })
      },
    )

    if (!subscription.closed)
      operations.set(operationId, () => {
        subscription.unsubscribe()
        operations.delete(operationId)
      })
  }

  return (rId: string, name: string, params: Array<any>) => {
    if (name === "follow") return follow(rId)
    const [followId, ...rest] = params as [string, ...any[]]
    const ctx = subscriptions.get(followId)
    if (!ctx) return err(rId, -32602, "Ivalid followSubscription")

    const innerReply = (value: any) => {
      reply(rId, value)
    }

    switch (name) {
      case "unfollow":
        return unfollow(rId, followId)
      case "stopOperation":
        return stopOperation(rId, followId, rest[0])
      case "unpin": {
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

        switch (name) {
          case "header":
            return header(ctx, innerReply, at)
          case "body":
            return body(ctx, innerReply, at)
          case "call": {
            const [method, data] = other
            if (typeof method !== "string" || typeof data !== "string")
              return err(rId, -32602, "Invalid args")
            return call(ctx, innerReply, at, method, data)
          }
          case "storage": {
            const [items] = other as [
              Array<{
                key: string
                type:
                  | "value"
                  | "hash"
                  | "closestDescendantMerkleValue"
                  | "descendantsValues"
                  | "descendantsHashes"
              }>,
            ]
            if (
              !Array.isArray(items) ||
              !items.every(
                (x) =>
                  typeof x === "object" &&
                  typeof x.key === "string" &&
                  validStorageTypes.has(x.type),
              )
            )
              return err(rId, -32602, "Invalid args")
            return stg(ctx, innerReply, at, items)
          }
        }
      }
    }
    err(rId, -32602, "Invalid method")
  }
}
