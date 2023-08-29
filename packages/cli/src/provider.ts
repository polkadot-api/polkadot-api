export const PROVIDER_WORKER_CODE = `
const { parentPort, workerData } = require("node:worker_threads")
const { ScProvider } = require("@unstoppablejs/sc-provider")
const { z } = require("zod")

const msgSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("send"), value: z.string() }),
  z.object({
    type: z.literal("open"),
  }),
  z.object({
    type: z.literal("close"),
  }),
])

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
  const parsedMsg = msgSchema.parse(msg)
  switch (parsedMsg.type) {
    case "send":
      provider.send(parsedMsg.value)
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
