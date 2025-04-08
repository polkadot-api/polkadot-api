import { createClient, PolkadotClient } from "polkadot-api"
import { afterAll, beforeAll } from "vitest"
import { getChopsticksProvider } from "./chopsticks"

let client: PolkadotClient = null as any
beforeAll(async () => {
  client = createClient(getChopsticksProvider())
  await client.getUnsafeApi().runtimeToken
})
afterAll(() => {
  client.destroy()
  client = null as any
})

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
  client.destroy()
  client = createClient(getChopsticksProvider())
  await client.getUnsafeApi().runtimeToken
}
