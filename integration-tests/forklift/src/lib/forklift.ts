import { spawn } from "child_process"
import { createWriteStream } from "fs"
import { createClient, PolkadotClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws"
import { getInnerLogs } from "./inner-logs"
import { wait } from "./utils"
import { withLogs } from "./with-logs"

const PORT = 8132
let { NODE_VERSION } = process.env
NODE_VERSION ||= "unknown"

let cleanup = () => {}

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

let id = 1
export const getForkliftProvider = (name: string) =>
  withLogs(
    `./LOGS_${NODE_VERSION}_${name}_${id++}_OUT_JSON_RPC`,
    getWsProvider(`ws://localhost:${PORT}`, {
      onStatusChanged: (x) => {
        console.log(x.type)
      },
      logger: getInnerLogs(name),
    }),
  )

export const startForklift = async () => {
  const logStream = createWriteStream(`./LOGS_${NODE_VERSION}_forklift.log`)
  const logStreamErr = createWriteStream(
    `./LOGS_${NODE_VERSION}_forklift_err.log`,
  )
  const forkliftProcess = spawn("pnpm", ["forklift", `-c`, `./forklift.yaml`])
  forkliftProcess.stdout.pipe(logStream)
  forkliftProcess.stderr.pipe(logStreamErr)

  const client = createClient(getForkliftProvider("main"))

  cleanup = () => {
    cleanup = () => {}
    client.destroy()
    forkliftProcess.kill()
    logStream.close()
    logStreamErr.close()
  }

  console.log("Connecting to forklift… (takes ~3 seconds)")
  const timeout = 15000
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

export const createBlock = (client: PolkadotClient) =>
  client._request("dev_newBlock", [])

export const stopForklift = () => cleanup()

export const restartForklift = async () => {
  stopForklift()
  await startForklift()
}
