import { spawn } from "child_process"
import { createWriteStream } from "fs"
import { createClient, PolkadotClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"

const ENDPOINT = "wss://rpc.ibp.network/paseo"
const PORT = 8132

let cleanup = () => {}

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

export const getChopsticksProvider = () =>
  getWsProvider(`ws://localhost:${PORT}`)

export const startChopsticks = async () => {
  const logStream = createWriteStream("./chopsticks.log")
  const logStreamErr = createWriteStream("./chopsticks_err.log")
  const chopsticksProcess = spawn("pnpm", [
    "chopsticks",
    `--block=0x446a006b992b7a760f718f0f7040aa94a10f8c329b46af7315ea7947fac2691e`,
    `--endpoint=${ENDPOINT}`,
    `--port=${PORT}`,
  ])
  chopsticksProcess.stdout.pipe(logStream)
  chopsticksProcess.stderr.pipe(logStreamErr)

  const client = createClient(getChopsticksProvider())

  console.log("Connecting to chopsticks… (takes ~3 seconds)")
  await client.getUnsafeApi().runtimeToken

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
