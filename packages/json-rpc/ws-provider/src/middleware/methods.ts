import { getAsyncProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { createParsedClient } from "@polkadot-api/raw-client"
import { ParsedJsonRpcEnhancer } from "./types"
import { jsonObj } from "./utils"
import { modern } from "./modern"
import { getLegacy } from "./legacy"
import { noop } from "@polkadot-api/utils"

const isModern = (methods: string[]): boolean =>
  methods.some(
    (x) =>
      x.startsWith("chainHead_v1") &&
      x.startsWith("transaction_v1") &&
      x.startsWith("archive_v1"),
  )

const RPC_METHODS = "rpc_methods"
const withMethods =
  (methods: string[]): ParsedJsonRpcEnhancer =>
  (base) =>
  (onMsg, onHalt) => {
    const result = { methods }
    const { send, disconnect } = base(onMsg, onHalt)
    return {
      disconnect,
      send(msg) {
        if ("id" in msg && (msg as any).method === RPC_METHODS) {
          onMsg(jsonObj({ id: msg.id, result }))
        } else send(msg)
      },
    }
  }

export const methods: ParsedJsonRpcEnhancer = (base) =>
  getAsyncProvider((onReady) => {
    let onMsg: <T extends {}>(msg: T) => void = noop
    let onHalt: (e?: any) => void = noop
    const innerConnection = base(
      (msg) => {
        onMsg(msg)
      },
      () => {
        // is not ready
        if (onMsg === noop) onReady(null)
        else onHalt()
      },
    )
    const { disconnect, request } = createParsedClient((_onMsg) => {
      onMsg = _onMsg
      return innerConnection
    })

    let nTries = 0
    let stopRequest: () => void = noop
    const getMethods = () => {
      nTries++
      stopRequest = request(RPC_METHODS, [], {
        onSuccess: ({ methods }: { methods: string[] }) => {
          const branch = isModern(methods) ? modern : getLegacy
          const applyMethods = withMethods(methods)
          onReady(
            applyMethods(
              branch((onMsgReadyMsg, onReadyHalt) => {
                onMsg = onMsgReadyMsg
                onHalt = onReadyHalt
                return innerConnection
              }),
            ),
          )
        },
        onError: () => {
          if (nTries > 3) {
            disconnect()
            onReady(null)
          } else getMethods()
        },
      })
    }
    getMethods()

    return () => {
      stopRequest()
      disconnect()
    }
  })
