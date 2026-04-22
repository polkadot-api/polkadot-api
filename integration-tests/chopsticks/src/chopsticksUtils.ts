import { createClient, PolkadotClient } from "polkadot-api"
import { afterAll, beforeAll } from "vitest"
import { getForkliftProvider } from "./chopsticks"

let client: PolkadotClient = null as any
beforeAll(async () => {
  client = createClient(getForkliftProvider("utils_before"))
  await client.getUnsafeApi().getStaticApis()
})
afterAll(() => {
  client.destroy()
  client = null as any
})

export const newBlock = (count?: number): Promise<string> =>
  Promise.all(
    new Array(count || 1)
      .fill(0)
      .map(() => client._request("dev_newBlock", [])),
  ).then((r) => r.at(-1)!)

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
  client = createClient(getForkliftProvider("jumpBlocks"))
  await client.getUnsafeApi().getStaticApis()
}
