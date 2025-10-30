import { createWriteStream, unlinkSync, WriteStream } from "fs"
import { SocketEvents, SocketLoggerFn } from "polkadot-api/ws"

let { NODE_VERSION } = process.env
NODE_VERSION ||= "unknown"

let innerIdx = 0
export const getInnerLogs: (name: string) => SocketLoggerFn = (name) => {
  const id = innerIdx++
  const actualFileName = `./LOGS_${NODE_VERSION}_${name}_${id}_IN_JSON_RPC`
  try {
    unlinkSync(actualFileName)
  } catch {}
  let file: WriteStream

  let tickDate = ""
  let token: any
  const setTickDate = () => {
    tickDate = new Date().toISOString()
    token = setTimeout(setTickDate, 0)
  }

  return (event) => {
    const { type } = event
    switch (type) {
      case SocketEvents.CONNECTING: {
        setTickDate()
        file = createWriteStream(actualFileName, { flags: "a" })
        break
      }
      case SocketEvents.IN:
      case SocketEvents.OUT: {
        const direction = type === SocketEvents.IN ? "<<" : ">>"
        file.write(`${id}-${tickDate}-${direction}-${event.msg}\n`)
        break
      }

      case SocketEvents.STALE:
      case SocketEvents.ERROR:
      case SocketEvents.CLOSE:
      case SocketEvents.DISCONNECT: {
        try {
          file.write(`${type}\n`)
          file.end()
          clearTimeout(token)
        } catch {}
      }
    }
  }
}
