import { withLogsRecorder } from "polkadot-api/logs-provider"
import { type JsonRpcProvider } from "polkadot-api"
import { createWriteStream, unlinkSync } from "fs"

export const withLogs = (
  fileName: string,
  provider: JsonRpcProvider,
): JsonRpcProvider => {
  let idx = 0
  return (onMsg) => {
    const actualFileName = fileName + idx++
    try {
      unlinkSync(actualFileName)
    } catch {}
    const file = createWriteStream(actualFileName, { flags: "a" })
    const base = withLogsRecorder((log) => {
      file.write(log + "\n")
    }, provider)
    const result = base(onMsg)
    return {
      ...result,
      disconnect: () => {
        file.write("----DISCONNECTED----\n")
        result.disconnect()
        file.end()
      },
    }
  }
}
