import type { Chain } from "smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

let pending: PromiseWithResolvers<Chain>

export const getSmProvider = (chain: Chain | Promise<Chain>): JsonRpcProvider =>
  getSyncProvider(async () => {
    if (pending !== undefined) {
      await pending.promise
    }

    let resolvedChain: Chain
    if (chain instanceof Promise) {
      // TODO: replace with `Promise.withResolvers`
      pending = withResolvers()
      try {
        resolvedChain = await chain
        pending.resolve(resolvedChain)
      } catch (error) {
        pending.reject(error)
        throw error
      }
    } else resolvedChain = chain

    return (listener, onError) => {
      let listening = true
      ;(async () => {
        do {
          let message = ""
          try {
            message = await resolvedChain.nextJsonRpcResponse()
          } catch (e) {
            if (listening) onError()
            return
          }
          if (!listening) break
          listener(message)
        } while (listening)
      })()

      return {
        send(msg: string) {
          resolvedChain.sendJsonRpc(msg)
        },
        disconnect() {
          listening = false
          resolvedChain.remove()
        },
      }
    }
  })

function withResolvers<TValue, TError = unknown>() {
  let resolve!: (value: TValue | PromiseLike<TValue>) => void
  let reject!: (error: TError) => void

  const promise = new Promise<TValue>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { promise, resolve, reject }
}
