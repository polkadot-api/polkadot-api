import { test } from "@polkadot-api/descriptors"
import { Bytes, metadata } from "@polkadot-api/substrate-bindings"
import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"

const client = createClient(getWsProvider("ws://localhost:9944"))
const api = client.getTypedApi(test)
api.query.System.BlockHash.watchEntries().subscribe((v) => {
  console.log(v.block.number, v.entries.length)
})

api.apis.Metadata.metadata_at_version(16).then((v) => {
  const meta = metadata.dec(v?.asBytes()!)
  Bun.file("metadata.json").write(JSON.stringify(meta, null, 2))
})
