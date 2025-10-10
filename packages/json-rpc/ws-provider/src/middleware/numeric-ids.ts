import { JsonRpcId, JsonRpcRequest } from "@polkadot-api/json-rpc-provider"
import { Middleware } from "./types"

export const withNumericIds: Middleware = (base) => (onMsg, onHalt) => {
  let nextId = 0
  const numberToOriginal = new Map<number, JsonRpcId>()
  const clear = () => {
    numberToOriginal.clear()
  }

  const { send: originalSend, disconnect } = base(
    (message: any) => {
      const { id } = message
      if (numberToOriginal.has(id)) {
        message.id = numberToOriginal.get(id)
        numberToOriginal.delete(id)
      }
      onMsg(message)
    },
    (e) => {
      clear()
      onHalt(e)
    },
  )

  return {
    send: (msg: JsonRpcRequest) => {
      if (msg.id !== undefined) {
        numberToOriginal.set(nextId, msg.id)
        msg.id = nextId++
      }
      originalSend(msg)
    },
    disconnect() {
      clear()
      disconnect()
    },
  }
}
