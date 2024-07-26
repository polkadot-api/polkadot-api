import type { Client } from "smoldot"
import {
  Worker,
  MessageChannel,
  MessagePort as NodeMessagePort,
  TransferListItem,
} from "node:worker_threads"
import {
  type SmoldotBytecode,
  type ClientOptionsWithBytecode,
  startWithBytecode,
} from "smoldot/no-auto-bytecode"

export type SmoldotOptions = Omit<
  ClientOptionsWithBytecode,
  "bytecode" | "portToWorker"
>

export const startFromWorker = (
  worker: Worker,
  options: SmoldotOptions = {},
): Client => {
  const bytecode = new Promise<SmoldotBytecode>((resolve) => {
    worker.once("message", resolve)
  })

  const { port1, port2 } = new MessageChannel()
  worker.postMessage(port1, [port1])

  return startWithBytecode({
    bytecode,
    portToWorker: nodeToWebMessagePort(port2),
    ...options,
  })
}

function nodeToWebMessagePort(port: NodeMessagePort): MessagePort {
  const result: MessagePort = {
    ...port,
    onmessage: null,
    onmessageerror: null,
    close() {
      port.close()
    },
    postMessage(message, transfer) {
      port.postMessage(message, webToNodeTransfer(transfer))
    },
    start() {
      port.start()
    },
  }

  port.on("message", (data) =>
    result.onmessage?.(
      new MessageEvent("message", {
        data,
      }),
    ),
  )
  port.on("messageerror", (data) =>
    result.onmessageerror?.(
      new MessageEvent("message", {
        data,
      }),
    ),
  )

  return result
}

function webToNodeTransfer(
  transfer: Transferable[] | StructuredSerializeOptions | undefined,
): TransferListItem[] | undefined {
  if (!transfer) return undefined

  const cleanedTransfer = Array.isArray(transfer) ? transfer : transfer.transfer
  if (!cleanedTransfer) return undefined

  return cleanedTransfer as any
}
