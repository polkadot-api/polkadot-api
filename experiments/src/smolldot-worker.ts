import { Subject } from "rxjs"
import { Worker } from "node:worker_threads"
import {
  GetProvider,
  ProviderStatus,
  WellKnownChain,
} from "@polkadot-api/sc-provider"

const PROVIDER_WORKER_CODE = `
const { parentPort, workerData } = require("node:worker_threads")
const { ScProvider } = require("@polkadot-api/sc-provider")

const chain = workerData
const getProvider = ScProvider(chain)

if (!parentPort) {
  throw new Error("no parent port")
}

const provider = getProvider(
  (msg) => parentPort.postMessage({ type: "message", value: msg }),
  (status) => parentPort.postMessage({ type: "status", value: status }),
)

parentPort.on("message", (msg) => {
  switch (msg.type) {
    case "send":
      provider.send(msg.value)
      break
    case "open":
      provider.open()
      break
    case "close":
      provider.close()
      break
  }
})
`

export const createProvider = (chain: WellKnownChain): GetProvider => {
  const worker = new Worker(PROVIDER_WORKER_CODE, {
    eval: true,
    workerData: chain,
    stderr: true,
    stdout: true,
  })

  const onMsgSubject = new Subject<string>()
  const onStatusSubject = new Subject<ProviderStatus>()

  worker.on("message", (msg) => {
    const parsedMsg = msg
    switch (parsedMsg.type) {
      case "message":
        onMsgSubject.next(parsedMsg.value)
        break
      case "status":
        onStatusSubject.next(parsedMsg.value)
        break
      default:
        break
    }
  })

  return (onMsg, onStatus) => {
    const sub1 = onMsgSubject.subscribe((msg) => onMsg(msg))
    const sub2 = onStatusSubject.subscribe((status) => onStatus(status))

    return {
      send: (msg) => worker.postMessage({ type: "send", value: msg }),
      open: () => worker.postMessage({ type: "open" }),
      close: () => {
        sub1.unsubscribe()
        sub2.unsubscribe()
        worker.postMessage({ type: "close" })
        worker.terminate()
      },
    }
  }
}
