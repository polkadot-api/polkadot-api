import { Middleware } from "./types"
import { apply, jsonObj } from "./utils"
import { noop } from "@polkadot-api/utils"
import { getAsyncMiddleware } from "./utils/get-async-middleware"

const RPC_METHODS = "rpc_methods"
const withMethods =
  (methods: string[]): Middleware =>
  (base) =>
  (onMsg, onHalt) => {
    const result = { methods }
    const { send, disconnect } = base(onMsg, onHalt)
    return {
      disconnect,
      send(msg) {
        if (msg.id && (msg as any).method === RPC_METHODS) {
          onMsg(jsonObj({ id: msg.id, result }))
        } else send(msg)
      },
    }
  }

export const methodsRouter = (
  getMiddleware: (methods: string[]) => Middleware,
): Middleware =>
  getAsyncMiddleware((onReady, request) => {
    let nTries = 0
    let stopRequest: () => void = noop
    const getMethods = () => {
      nTries++
      stopRequest = request(RPC_METHODS, [], {
        onSuccess: ({ methods }: { methods: string[] }) => {
          onReady(apply(withMethods(methods), getMiddleware(methods)))
        },
        onError: () => {
          if (nTries > 3) onReady(null)
          else {
            const token = setTimeout(getMethods, 500)
            stopRequest = () => clearTimeout(token)
          }
        },
      })
    }
    getMethods()

    return () => stopRequest()
  })
