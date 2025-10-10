import { Middleware } from "./types"
import { jsonObj } from "./utils"
import { modern } from "./modern"
import { getLegacy } from "./legacy"
import { noop } from "@polkadot-api/utils"
import { getAsyncMiddleware } from "./utils/get-async-middleware"

const isModern = (methods: string[]): boolean =>
  methods.some((x) => x.startsWith("chainHead_v1")) &&
  methods.some((x) => x.startsWith("transaction_v1")) &&
  methods.some((x) => x.startsWith("archive_v1"))

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

export const methods: Middleware = getAsyncMiddleware((onReady, request) => {
  let nTries = 0
  let stopRequest: () => void = noop
  const getMethods = () => {
    nTries++
    stopRequest = request(RPC_METHODS, [], {
      onSuccess: ({ methods }: { methods: string[] }) => {
        const applyMethods = withMethods(methods)
        const branch = isModern(methods) ? modern : getLegacy
        onReady((base) => applyMethods(branch(base)))
      },
      onError: () => {
        if (nTries > 3) {
          onReady(null)
        } else {
          const token = setTimeout(getMethods, 500)
          stopRequest = () => clearTimeout(token)
        }
      },
    })
  }
  getMethods()

  return () => stopRequest()
})
