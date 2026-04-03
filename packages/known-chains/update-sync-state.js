import { createClient } from "@polkadot-api/substrate-client"
import { getWsProvider } from "@polkadot-api/ws-provider"
import { readFile, writeFile } from "node:fs/promises"

const CHAINS = {
  polkadot: "wss://rpc.polkadot.io",
  kusama: "wss://kusama-rpc.polkadot.io",
  westend: "wss://westend-rpc.polkadot.io",
  paseo: "wss://paseo.rpc.amforc.com",
}

const main = async () => {
  Object.entries(CHAINS).forEach(async ([name, rpc]) => {
    try {
      const filename = `./specs/${name}.json`
      const client = createClient(getWsProvider(rpc))
      const [{ lightSyncState }, spec] = await Promise.all([
        client.request("sync_state_genSyncSpec", [true]),
        readFile(filename, "utf8").then((v) => JSON.parse(v)),
      ])
      spec.lightSyncState = lightSyncState
      await writeFile(filename, JSON.stringify(spec, null, 2) + "\n")
      client.destroy()
      console.log(`${name} done`)
    } catch {
      console.warn(`${name} DIDN'T WORK`)
    }
  })
}
main()
