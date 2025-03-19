import { spawn } from "child_process"
import { createWriteStream } from "fs"
import { createClient, PolkadotClient, UnsafeApi } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/node"
import { afterAll, beforeAll } from "vitest"

const ENDPOINT = "wss://rpc.ibp.network/paseo"
const PORT = 8132

let cleanup = () => {}
let client: PolkadotClient = null as any
let api: UnsafeApi<unknown> = null as any

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

export const getChopsticksProvider = () =>
  getWsProvider(`ws://localhost:${PORT}`)
const setup = async () => {
  const logStream = createWriteStream("./chopsticks.log")
  const logStreamErr = createWriteStream("./chopsticks_err.log")
  const chopsticksProcess = spawn("pnpm", [
    "chopsticks",
    `--endpoint=${ENDPOINT}`,
    `--port=${PORT}`,
  ])
  chopsticksProcess.stdout.pipe(logStream)
  chopsticksProcess.stderr.pipe(logStreamErr)

  client = createClient(getChopsticksProvider())
  api = client.getUnsafeApi()

  console.log(
    "Connecting to chopsticks… It might take a few retries until the chain is up",
  )
  await api.runtimeToken

  cleanup = () => {
    cleanup = () => {}
    client.destroy()
    chopsticksProcess.kill()
    logStream.close()
    logStreamErr.close()
  }
}

beforeAll(setup)
afterAll(() => cleanup())

export const restartChopsticks = async () => {
  cleanup()
  await setup()
}

export const newBlock = (count?: number): Promise<string> =>
  client._request("dev_newBlock", [{ count }])

export const jumpBlocks = async (height: number, count?: number) => {
  await client._request("dev_newBlock", [
    {
      count,
      unsafeBlockHeight: height,
    },
  ])

  // Because the height jump, we have to restart the client
  // otherwise the block height will be wrong on new tx
  console.log("Restarting client")
  client.destroy()
  client = createClient(getWsProvider(`ws://localhost:${PORT}`))
  api = client.getUnsafeApi()
  await api.runtimeToken
}
