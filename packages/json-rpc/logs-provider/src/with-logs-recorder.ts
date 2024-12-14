import type { JsonRpcProvider } from "./public-types"
import { IN, OUT } from "./types"

export const withLogsRecorder = (
  persistLog: (log: string) => void,
  input: JsonRpcProvider,
): JsonRpcProvider => {
  let nextId = 1
  let token: any
  let tickDate = ""
  const setTickDate = () => {
    tickDate = new Date().toISOString()
    token = setTimeout(setTickDate, 0)
  }

  return (onMsg) => {
    const clientId = nextId++

    setTickDate()

    const result = input((msg) => {
      persistLog(`${clientId}-${tickDate}-${IN}-${msg}`)
      onMsg(msg)
    })

    return {
      ...result,
      send: (msg) => {
        persistLog(`${clientId}-${tickDate}-${OUT}-${msg}`)
        result.send(msg)
      },
      disconnect() {
        clearTimeout(token)
        result.disconnect()
      },
    }
  }
}
