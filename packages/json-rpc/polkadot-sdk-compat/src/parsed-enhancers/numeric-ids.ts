import type { ParsedJsonRpcEnhancer } from "@/parsed"

export const withNumericIds: ParsedJsonRpcEnhancer = (base) => (onMsg) => {
  let nextId = 0
  const numberToOriginal = new Map<number, string>()

  const { send: originalSend, disconnect } = base((message: any) => {
    if (numberToOriginal.has(message.id))
      message.id = numberToOriginal.get(message.id)
    onMsg(message)
  })

  return {
    send: (msg: { id?: any }) => {
      if ("id" in msg) {
        const id = nextId++
        numberToOriginal.set(id, msg.id)
        msg.id = id
      }
      originalSend(msg)
    },
    disconnect,
  }
}
