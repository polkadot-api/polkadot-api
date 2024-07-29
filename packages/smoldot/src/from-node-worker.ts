import { Worker } from "node:worker_threads"
import type { Client } from "smoldot"
import type { RequestMessage, SmoldotOptions } from "./node-worker"

export const startFromWorker = (
  worker: Worker,
  options: SmoldotOptions = {},
): Client => {
  sendToWorker(worker, {
    type: "start",
    value: options,
  })

  return {
    async addChain(options) {
      const id = await sendToWorker(worker, {
        type: "add-chain",
        value: options,
      })
      return {
        nextJsonRpcResponse() {
          return sendToWorker(worker, {
            type: "chain",
            value: {
              id,
              type: "receive",
            },
          })
        },
        remove() {
          return sendToWorker(worker, {
            type: "chain",
            value: {
              id,
              type: "remove",
            },
          })
        },
        sendJsonRpc(value) {
          return sendToWorker(worker, {
            type: "chain",
            value: {
              id,
              type: "send",
              value,
            },
          })
        },
      }
    },
    async terminate() {
      await sendToWorker(worker, {
        type: "terminate",
      })
    },
  }
}

let msgId = 0
function sendToWorker(worker: Worker, msg: RequestMessage): Promise<any> {
  const id = msgId++
  worker.postMessage({ ...msg, id })
  return new Promise((resolve) => {
    const msgHandler = (response: any) => {
      if (response.id === id) {
        resolve(response.value)
        worker.off("message", msgHandler)
      }
    }
    worker.on("message", msgHandler)
  })
}
