import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export const withNumericIds =
  (base: JsonRpcProvider): JsonRpcProvider =>
  (onMsg) => {
    let nextId = 0
    const numberToOriginal = new Map<number, string>()

    const { send: originalSend, disconnect } = base((msg: string) => {
      const { id, ...rest } = JSON.parse(msg)
      let actualMsg = msg
      if (numberToOriginal.has(id)) {
        actualMsg = JSON.stringify({ ...rest, id: numberToOriginal.get(id) })
        numberToOriginal.delete(id)
      }
      onMsg(actualMsg)
    })

    return {
      send: (msg) => {
        const parsedMsg = JSON.parse(msg)
        let actualMsg = msg
        if ("id" in parsedMsg) {
          const id = nextId++
          numberToOriginal.set(id, parsedMsg.id)
          actualMsg = JSON.stringify({ ...parsedMsg, id })
        }
        originalSend(actualMsg)
      },
      disconnect,
    }
  }
