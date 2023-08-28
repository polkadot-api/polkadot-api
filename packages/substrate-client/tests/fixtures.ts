import { createClient } from "@/index"
import type { GetProvider } from "@unstoppablejs/provider"

export const createTestClient = () => {
  let onMessage: (msg: string) => void
  const sendMessage = (msg: {}) => {
    onMessage(JSON.stringify({ ...msg, jsonrpc: "2.0" }))
  }

  const receivedMessages: Array<string> = []

  const provider: GetProvider = (_onMessage, _onStatus) => {
    onMessage = _onMessage
    return {
      send(msg) {
        receivedMessages.push(msg)
      },
      open() {
        _onStatus(0)
      },
      close() {},
    }
  }

  const client = createClient(provider)

  let latestIdx = 0
  const getNewMessages = () => {
    const result = receivedMessages.slice(latestIdx).map((m) => JSON.parse(m))
    latestIdx = receivedMessages.length
    return result
  }

  const getAllMessages = () =>
    receivedMessages.slice(0).map((m) => JSON.parse(m))

  return {
    client,
    fixtures: {
      sendMessage,
      getNewMessages,
      getAllMessages,
    },
  }
}
