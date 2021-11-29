import { GetProvider } from "@unstoppablejs/provider"
import type { Client, InteropObservable } from "../types"
import { createRawClient } from "./RawClient"
import { ErrorRpc } from "./ErrorRpc"
import { getInteropObservable } from "../utils/InteropObservable"

type OnData<T = any> = (data: T) => void

interface CacheItem {
  listeners: Set<OnData>
  close: () => void
}

// Do not make it public: https://github.com/ReactiveX/rxjs/pull/6675#pullrequestreview-816542124
class AbortError extends Error {
  constructor() {
    super("Aborted by AbortSignal")
    this.name = "AbortError"
  }
}

const finalize =
  (id: string, cb: OnData, map: Map<string, CacheItem>) => () => {
    const val = map.get(id)
    if (val) {
      val.listeners.delete(cb)
      if (val.listeners.size === 0) {
        val.close()
        val.listeners.clear()
        map.delete(id)
      }
    }
  }

const identity = <T>(x: T) => x

export const createClient = (gProvider: GetProvider): Client => {
  const client = createRawClient(gProvider)

  const subscriptions = new Map<string, CacheItem & { lastVal?: any }>()
  const requestReplies = new Map<string, CacheItem>()

  const getObservable = <I, O = I>(
    subs: string,
    unsubs: string,
    params: Array<any>,
    mapper: (i: I) => O = identity as any,
    namespace?: string,
  ): InteropObservable<O> => {
    const parametersStr = JSON.stringify(params)
    const id = `${subs}.${parametersStr}`

    return getInteropObservable<O>(({ next, error }) => {
      const cb = (data: any) => {
        try {
          if (data instanceof ErrorRpc) throw data
          next(mapper(data))
        } catch (e) {
          cleanup && cleanup()
          error(e)
        }
      }

      if (!subscriptions.has(id)) {
        const sub: Partial<CacheItem & { lastVal?: any }> = {
          listeners: new Set([cb]),
        }
        subscriptions.set(id, sub as CacheItem)
        sub.close = client.request<I>(
          subs,
          parametersStr,
          (result) => {
            subscriptions.get(id)?.listeners.forEach((icb) => {
              sub.lastVal = result
              icb(result)
            })
          },
          unsubs,
        )
      } else {
        const entry = subscriptions.get(id)!
        if (entry.hasOwnProperty("lastVal")) cb(entry.lastVal!)
        subscriptions.get(id)!.listeners.add(cb)
      }

      const cleanup = finalize(id, cb, subscriptions)
      return cleanup
    }, namespace ?? `${id}_${parametersStr}`)
  }

  const requestReply = <I, O = I>(
    method: string,
    params: Array<any>,
    mapper: (data: I) => O = (x: I) => x as unknown as O,
    subs?: string,
    abortSignal?: AbortSignal,
  ): Promise<O> =>
    new Promise<O>((res, rej) => {
      const parametersStr = JSON.stringify(params)
      const subId = `${subs}.${parametersStr}`
      const sub = subscriptions.get(subId)
      let teardown: (() => void) | null = null
      let active = true

      function onAbort() {
        abortSignal!.removeEventListener("abort", onAbort)
        if (active) {
          /* istanbul ignore next */
          const reason = abortSignal!.hasOwnProperty("reason")
            ? (abortSignal! as any).reason
            : new AbortError()
          rej(reason)
        }
        teardown?.()
      }

      const cb = (data: I): void => {
        active = false
        abortSignal?.removeEventListener("abort", onAbort)
        try {
          if (data instanceof ErrorRpc) throw data
          res(mapper(data))
        } catch (e) {
          rej(e)
        } finally {
          teardown?.()
        }
      }

      if (sub) {
        if (sub.hasOwnProperty("lastVal")) return cb(sub.lastVal)
        teardown = finalize(subId, cb, subscriptions)
        return sub.listeners.add(cb)
      }

      const id = `${method}.${parametersStr}`
      const requestReply = requestReplies.get(id)

      if (requestReply) {
        requestReply.listeners.add(cb)
      } else {
        const replyObj: Partial<CacheItem> = {
          listeners: new Set([cb]),
        }
        requestReplies.set(id, replyObj as CacheItem)
        try {
          replyObj.close = client.request<I>(method, parametersStr, (val) => {
            replyObj.listeners!.forEach((icb) => {
              icb(val)
            })
            replyObj.listeners!.clear()
            requestReplies.delete(id)
          })
        } catch (e) {
          rej(e)
          replyObj.listeners!.clear()
          requestReplies.delete(id)
        }
      }

      teardown = finalize(id, cb, requestReplies)
      if (abortSignal && active) abortSignal.addEventListener("abort", onAbort)
    })

  return {
    ...client,
    requestReply,
    getObservable,
  }
}
