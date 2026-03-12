import type { Client } from "@polkadot-api/smoldot-patch"
import {
  type SmoldotBytecode,
  type ClientOptionsWithBytecode,
  startWithBytecode,
} from "@polkadot-api/smoldot-patch/no-auto-bytecode"

export type SmoldotOptions = Omit<
  ClientOptionsWithBytecode,
  "bytecode" | "portToWorker"
>

export const startFromWorker = (
  worker: Worker,
  options: SmoldotOptions = {},
): Client => {
  const bytecode = new Promise<SmoldotBytecode>((resolve) => {
    worker.onmessage = (event) => resolve(event.data)
  })

  const { port1, port2 } = new MessageChannel()
  worker.postMessage(port1, [port1])

  return startWithBytecode({
    bytecode,
    portToWorker: port2,
    ...options,
  })
}
