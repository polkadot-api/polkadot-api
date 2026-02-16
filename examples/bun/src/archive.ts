import { createClient } from "@polkadot-api/substrate-client"
import { getWsProvider } from "polkadot-api/ws"

const client = createClient(getWsProvider("wss://rpc.ibp.network/polkadot"))

console.log("requesting height")
const height = await client.archive.finalizedHeight()
console.log({ height })

const [hash] = await client.archive.hashByHeight(height)
console.log({ hash })

// Staking.Nominators
const result = await client.archive.storage(
  hash,
  "descendantsValues",
  "0x5f3e4907f716ac89b6347d15ececedca9c6a637f62ae2af1c7e31eed7e96be04",
  null,
)
console.log(result)
