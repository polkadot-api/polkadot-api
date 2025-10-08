import {
  AddChainError,
  AlreadyDestroyedError,
  CrashError,
  JsonRpcDisabledError,
  type Chain,
} from "@polkadot-api/smoldot"
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

let pending: Promise<any> | null

const isRecoverable = (error: any) =>
  !(
    error instanceof AddChainError ||
    error instanceof AlreadyDestroyedError ||
    error instanceof CrashError ||
    error instanceof JsonRpcDisabledError
  )

const noop = () => {}
export const getSmProvider = (
  inputChain: Chain | Promise<Chain>,
): JsonRpcProvider =>
  getSyncProvider((onReady) => {
    let isRunning = true

    const start = (): any => {
      if (!isRunning) return
      if (pending) return pending.then(start)

      const onResolveChain = (chain: Chain) => {
        let isListening = isRunning
        if (!isListening) return chain.remove()

        onReady((onMsgOut, _onhalt) => {
          const onhalt = (e?: any) => {
            if (isListening) {
              isListening = false
              if (isRecoverable(e)) _onhalt(e)
            }
          }

          const onMsgIn = (msg: string | null = null) => {
            if (isListening!) return
            msg && onMsgOut(msg)
            chain.nextJsonRpcResponse().then(onMsgIn, onhalt)
          }
          onMsgIn()

          return {
            send(msg) {
              isListening && chain.sendJsonRpc(msg)
            },
            disconnect() {
              isListening = false
              chain.remove()
            },
          }
        })
      }

      if (inputChain instanceof Promise) {
        pending = inputChain.catch(noop)
        inputChain.then(onResolveChain, (e) => {
          if (isRunning && isRecoverable(e)) onReady(null)
        })
        pending = null
      } else onResolveChain(inputChain)
    }
    start()

    return () => {
      isRunning = false
    }
  })
