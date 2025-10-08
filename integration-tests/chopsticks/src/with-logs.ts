import { withLogsRecorder } from "polkadot-api/logs-provider"
import { type JsonRpcProvider } from "polkadot-api/ws-provider"
import { createWriteStream, unlinkSync } from "fs"

export const withLogs = (
  fileName: string,
  provider: JsonRpcProvider,
): JsonRpcProvider => {
  return (onMsg) => {
    try {
      unlinkSync(fileName)
    } catch {}
    const file = createWriteStream(fileName, { flags: "a" })
    const base = withLogsRecorder((log) => {
      file.write(log + "\n")
    }, provider)
    const result = base(onMsg)
    return {
      ...result,
      disconnect: () => {
        result.disconnect()
        file.end()
      },
    }
  }
}
