import {
  AddChainError,
  AlreadyDestroyedError,
  CrashError,
  JsonRpcDisabledError,
  type Chain,
} from "@polkadot-api/smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  getSyncProvider,
  InnerJsonRpcProvider,
} from "@polkadot-api/json-rpc-provider-proxy"

let pending: Promise<any> | null

const isRecoverable = (error: any) =>
  !(
    error instanceof AddChainError ||
    error instanceof AlreadyDestroyedError ||
    error instanceof CrashError ||
    error instanceof JsonRpcDisabledError
  )

export const getSmProvider = (chain: Chain | Promise<Chain>): JsonRpcProvider =>
  getSyncProvider((onReady) => {
    let isRunning = true
    let resolvedChain: Chain
    const provider: InnerJsonRpcProvider = (onMsg, onHalt) => {
      let listening = isRunning
      ;(async () => {
        do {
          let message = ""
          try {
            message = await resolvedChain.nextJsonRpcResponse()
          } catch (e) {
            if (listening && isRecoverable(e)) {
              onHalt(e)
            }
            return
          }
          if (!listening) break
          onMsg(JSON.parse(message))
        } while (listening)
      })()

      return {
        send(msg) {
          resolvedChain.sendJsonRpc(JSON.stringify(msg))
        },
        disconnect() {
          listening = false
          resolvedChain.remove()
        },
      }
    }

    ;(async () => {
      try {
        while (isRunning && pending) await pending
        if (chain instanceof Promise) {
          pending = chain.catch(() => {})
          resolvedChain = await chain
          pending = null
        } else resolvedChain = chain

        onReady(isRunning ? provider : null)
      } catch {
        onReady(null)
      }
    })()

    return () => {
      isRunning = false
    }
  })
