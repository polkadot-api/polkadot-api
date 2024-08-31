import { createClient } from "polkadot-api"
import { logsProvider } from "polkadot-api/logs-provider"
import { fixUnorderedBlocks, parsed } from "polkadot-api/polkadot-sdk-compat"

// For reference, see: https://github.com/polkadot-api/polkadot-api/issues/671
const enhancer = parsed(fixUnorderedBlocks)
const file = await fetch(
  "https://raw.githubusercontent.com/ryanleecode/papi-test-671/1a3d7135205078078a544fd9744087f66b34ce9d/test7.log",
)
const logs = (await file.text()).trim().split("\n")
const client = createClient(enhancer(logsProvider(logs, { speed: 40 })))

client.bestBlocks$.subscribe(console.log)
