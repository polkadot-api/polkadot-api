import type { ParsedJsonRpcEnhancer } from "@/parsed"

export const withNumericIds: ParsedJsonRpcEnhancer = (base) => (onMsg) => {
  let nextId = 0
  const numberToOriginal = new Map<number, string>()

  const { send: originalSend, disconnect } = base((message: any) => {
    const { id } = message
    if (numberToOriginal.has(id)) {
      message.id = numberToOriginal.get(id)
      numberToOriginal.delete(id)
    }
    onMsg(message)
  })

  return {
    send: (msg: { id?: any }) => {
      if ("id" in msg) {
        numberToOriginal.set(nextId, msg.id)
        msg.id = nextId++
      }
      originalSend(msg)
    },
    disconnect,
  }
}
