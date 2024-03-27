import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import Queue from "./queue"
import { In, OUT, Out } from "./types"

interface Log {
  clientId: number
  type: In | Out
  msg: string
  tick: number
}

const rawLogsToLogs = (rawLogs: string[]): Map<number, Log[]> => {
  const result = new Map<number, Log[]>()
  let prevDate = ""
  let tick = -1

  for (let i = 0; i < rawLogs.length; i++) {
    const [, clientIdRaw, dateRaw, type, msg] = rawLogs[i].match(
      /^(\d*)-(.{24})-(.{2})-(.*)$/,
    )!
    const clientId = Number(clientIdRaw)

    tick += dateRaw === prevDate ? 0 : 1
    prevDate = dateRaw

    const logs = result.get(clientId) ?? []
    result.set(clientId, logs)

    logs.push({
      clientId,
      tick,
      type: type as any,
      msg,
    })
  }

  return result
}

export const logsProvider = (rawLogs: Array<string>): JsonRpcProvider => {
  let nextClientId = 1
  const allLogs = rawLogsToLogs(
    rawLogs[rawLogs.length - 1] ? rawLogs : rawLogs.slice(0, -1),
  )

  return (onMsg) => {
    const clientId = nextClientId++
    const logs = allLogs.get(clientId)!
    const pending = new Queue<string>()
    let idx = 0

    const checkForIncommingMessages = async () => {
      if (!pending.peek) return

      while (idx < logs.length && token !== undefined) {
        const expected = logs[idx]
        if (expected.type === OUT) {
          if (!pending.peek()) {
            token = setTimeout(checkForIncommingMessages, 100)
            break
          }
          const received = pending.pop()
          if (received !== expected.msg) {
            console.log("recieved: ", received)
            console.log(received)
            console.log("expected: ", expected.msg)
            throw new Error("unexpected messaged was received")
          }
        } else {
          onMsg(expected.msg)
          await Promise.resolve()
        }
        idx++
      }
    }

    let token: undefined | number = setTimeout(checkForIncommingMessages, 200)

    return {
      send: (msg) => {
        pending.push(msg)
      },
      disconnect: () => {
        clearTimeout(token)
        token = undefined
      },
    }
  }
}
