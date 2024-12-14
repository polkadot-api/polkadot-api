import type { JsonRpcProvider } from "./public-types"
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
  let tick = -1

  for (let i = 0; i < rawLogs.length; i++) {
    const [, clientIdRaw, dateRaw, type, msg] = rawLogs[i].match(
      /^(\d*)-(.{24})-(.{2})-(.*)$/,
    )!
    const clientId = Number(clientIdRaw)

    tick = new Date(dateRaw).getTime()

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

const extractTx = (msg: string) => {
  const startTxt = 'TaggedTransactionQueue_validate_transaction","'
  const start = msg.lastIndexOf(startTxt) + startTxt.length + 4
  const end = msg.indexOf(`"`, start + 1)
  return msg.substring(start, end - 64)
}

export type LogsProviderOptions = {
  speed: number
}
const defaultOptions: LogsProviderOptions = { speed: 1 }
export const logsProvider = (
  rawLogs: Array<string>,
  options: Partial<LogsProviderOptions> = {},
): JsonRpcProvider => {
  const { speed } = { ...defaultOptions, ...options }
  let nextClientId = 1
  const allLogs = rawLogsToLogs(
    rawLogs[rawLogs.length - 1] ? rawLogs : rawLogs.slice(0, -1),
  )

  return (onMsg) => {
    const clientId = nextClientId++
    const logs = allLogs.get(clientId)!
    const pending = new Queue<string>()
    let idx = 0

    let transactions = new Map<string, string>()
    const checkForIncommingMessages = async () => {
      if (!pending.peek()) return

      while (idx < logs.length && token !== undefined) {
        const expected = logs[idx]
        transactions.forEach((value, key) => {
          expected.msg = expected.msg.replace(key, value)
        })
        if (expected.type === OUT) {
          if (!pending.peek()) {
            token = setTimeout(checkForIncommingMessages, 100)
            break
          }

          const received = pending.pop()

          if (
            expected.msg.includes(
              "TaggedTransactionQueue_validate_transaction",
            ) &&
            received?.includes("TaggedTransactionQueue_validate_transaction")
          ) {
            transactions.set(extractTx(expected.msg), extractTx(received))
            transactions.forEach((value, key) => {
              expected.msg = expected.msg.replace(key, value)
            })
          }

          if (received !== expected.msg) {
            console.log(`recieved: "${received}"`)
            console.log(`expected: "${expected.msg}"`)
            throw new Error("unexpected messaged was received")
          }
        } else {
          onMsg(expected.msg)
          const nextOne = logs[idx + 1]
          if (nextOne)
            await new Promise((res) =>
              setTimeout(res, (nextOne.tick - expected.tick) / speed),
            )
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
