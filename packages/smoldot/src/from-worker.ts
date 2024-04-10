import { type Client } from "smoldot"
import {
  type SmoldotBytecode,
  startWithBytecode,
} from "smoldot/no-auto-bytecode"

export const startFromWorker = (worker: Worker): Client => {
  const bytecode = new Promise<SmoldotBytecode>((resolve) => {
    worker.onmessage = (event) => resolve(event.data)
  })

  const { port1, port2 } = new MessageChannel()
  worker.postMessage(port1, [port1])

  return startWithBytecode({
    bytecode,
    portToWorker: port2,
  })
}
