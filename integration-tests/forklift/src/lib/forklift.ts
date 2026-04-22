import { forklift, logger, wsSource } from "@polkadot-api/forklift"
import { spawn } from "child_process"
import { createWriteStream } from "fs"
import { createClient, Enum } from "polkadot-api"
import { wait } from "./utils"
import { withLogs } from "./with-logs"

logger.level = "silent"

const PORT = 8132
let { NODE_VERSION } = process.env
NODE_VERSION ||= "unknown"

let cleanup = () => {}

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

let id = 1
export const getForkliftProvider = (name: string) => {
  // To help on test isolation, we will create one forklift instance per each provider.
  // Otherwise, test running in parallel could compete when testing reorgs against the same instance
  const chain = forklift(wsSource(`ws://localhost:${PORT}`), {
    finalizeMode: Enum("timer", 0),
  })

  return [
    withLogs(`./LOGS_${NODE_VERSION}_${name}_${id++}_OUT_JSON_RPC`, (onMsg) => {
      const connection = chain.serve(onMsg)
      return {
        ...connection,
        disconnect: () => {
          connection.disconnect()
          chain.destroy()
        },
      }
    }),
    chain,
  ] as const
}

export const startForklift = async () => {
  const logStream = createWriteStream(`./LOGS_${NODE_VERSION}_forklift.log`)
  const logStreamErr = createWriteStream(
    `./LOGS_${NODE_VERSION}_forklift_err.log`,
  )
  const forkliftProcess = spawn("pnpm", ["forklift", `-c`, `./forklift.yaml`])
  forkliftProcess.stdout.pipe(logStream)
  forkliftProcess.stderr.pipe(logStreamErr)

  const client = createClient(getForkliftProvider("main")[0])

  cleanup = () => {
    cleanup = () => {}
    client.destroy()
    forkliftProcess.kill()
    logStream.close()
    logStreamErr.close()
  }

  console.log("Connecting to forklift…")
  const timeout = 5000
  const success = await Promise.race([
    client
      .getUnsafeApi()
      .getStaticApis()
      .then(() => true),
    wait(timeout).then(() => false),
  ])
  if (!success) {
    cleanup()
    throw new Error(`Couldn't connect after ${timeout}ms`)
  }

  // Create a new block to pre-initialize forklift and prevent tests from timing out.
  console.log("Generating the first block… (takes ~8 seconds)")
  await client._request("dev_newBlock", [])
}

export const stopForklift = () => cleanup()
