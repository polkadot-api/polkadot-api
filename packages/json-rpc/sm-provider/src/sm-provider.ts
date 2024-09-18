import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import {
  type Chain,
  AddChainError,
  AlreadyDestroyedError,
  CrashError,
  JsonRpcDisabledError,
} from "smoldot"

let pending: Promise<Chain> | null

export const getSmProvider = (chain: Chain | Promise<Chain>): JsonRpcProvider =>
  getSyncProvider(async () => {
    while (pending) await pending

    let resolvedChain: Chain
    if (chain instanceof Promise) {
      pending = chain
      resolvedChain = await chain
      pending = null
    } else resolvedChain = chain

    return (listener, onError) => {
      let listening = true
      ;(async () => {
        do {
          let message = ""
          try {
            message = await resolvedChain.nextJsonRpcResponse()
          } catch (error) {
            if (listening)
              onError({
                recoverable: !(
                  error instanceof AddChainError ||
                  error instanceof AlreadyDestroyedError ||
                  error instanceof CrashError ||
                  error instanceof JsonRpcDisabledError
                ),
              })

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
