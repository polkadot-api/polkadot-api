import { createClient, PolkadotClient } from "polkadot-api"
import { getChopsticksProvider } from "./provider"

let cleanup = () => {}

export const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
export const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

export const startChopsticks = async () => {
  const client = createClient(getChopsticksProvider())

  console.log("Connecting to chopsticks… (takes ~3 seconds)")
  await client.getUnsafeApi().runtimeToken

  // Create a new block to pre-initialize chopsticks and prevent tests from timing out.
  console.log("Generating the first block… (takes ~8 seconds)")
  await client._request("dev_newBlock", [])

  cleanup = () => {
    cleanup = () => {}
    client.destroy()
  }
}

export const createBlock = (client: PolkadotClient) =>
  client._request("dev_newBlock", [])

export const stopChopsticks = () => cleanup()

export const restartChopsticks = async () => {
  stopChopsticks()
  await startChopsticks()
}
