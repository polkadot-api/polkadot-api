import { spawn } from "child_process"
import { createWriteStream } from "fs"
import { createClient, PolkadotClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws"
import { getInnerLogs } from "./inner-logs"
import { withLogs } from "./with-logs"

const ENDPOINT = "wss://rpc.ibp.network/paseo"
const PORT = 8132
let { NODE_VERSION } = process.env
NODE_VERSION ||= "unknown"

let cleanup = () => {}

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

let id = 1
export const getChopsticksProvider = (name: string) =>
  withLogs(
    `./LOGS_${NODE_VERSION}_${name}_${id++}_OUT_JSON_RPC`,
    getWsProvider(`ws://localhost:${PORT}`, {
      onStatusChanged: (x) => {
        console.log(x.type)
      },
      logger: getInnerLogs(name),
    }),
  )

export const startChopsticks = async () => {
  const logStream = createWriteStream(`./LOGS_${NODE_VERSION}_chopsticks.log`)
  const logStreamErr = createWriteStream(
    `./LOGS_${NODE_VERSION}_chopsticks_err.log`,
  )
  const chopsticksProcess = spawn("pnpm", [
    "chopsticks",
    `--block=0x446a006b992b7a760f718f0f7040aa94a10f8c329b46af7315ea7947fac2691e`,
    `--endpoint=${ENDPOINT}`,
    `--port=${PORT}`,
  ])
  chopsticksProcess.stdout.pipe(logStream)
  chopsticksProcess.stderr.pipe(logStreamErr)

  const client = createClient(getChopsticksProvider("main"))

  console.log("Connecting to chopsticks… (takes ~3 seconds)")
  await client.getUnsafeApi().getStaticApis()

  // Create a new block to pre-initialize chopsticks and prevent tests from timing out.
  console.log("Generating the first block… (takes ~8 seconds)")
  await client._request("dev_newBlock", [])

  cleanup = () => {
    cleanup = () => {}
    client.destroy()
    chopsticksProcess.kill()
    logStream.close()
    logStreamErr.close()
  }
}

export const createBlock = (client: PolkadotClient) =>
  client._request("dev_newBlock", [])

export const stopChopsticks = () => cleanup()

export const restartChopsticks = async () => {
  stopChopsticks()
  await startChopsticks()
}
