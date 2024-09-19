import { openSync, writeSync } from "node:fs"
import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { wnd } from "@polkadot-api/descriptors"
import { withLogsRecorder } from "polkadot-api/logs-provider"
import { fixUnorderedBlocks, parsed } from "polkadot-api/polkadot-sdk-compat"

const pre = openSync("pre.log", "w")
const post = openSync("post.log", "w")

const client = createClient(
  withLogsRecorder(
    (log) => {
      writeSync(post, `${log}\n`)
    },
    parsed(fixUnorderedBlocks)(
      withLogsRecorder((log) => {
        writeSync(pre, `${log}\n`)
      }, getWsProvider("wss://sys.dotters.network/paseo")),
    ),
  ),
)

const api = client.getTypedApi(wnd)

api.query.System.Account.watchValue(
  "15roJ4ZrgrZam5BQWJgiGHpgp7ShFQBRNLq6qUfiNqXDZjMK",
).subscribe((x) => {
  console.log("Account change", x.data)
}, console.error)

client.finalizedBlock$.subscribe(console.log, console.error)
