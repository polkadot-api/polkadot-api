import { createClient } from "@polkadot-api/client"
import { logsProvider } from "@polkadot-api/client/logs-provider"
import { roc } from "@polkadot-api/descriptors"
import { readFile } from "fs/promises"

const LOG_FILE = "./src/undefined-runtime/logs.txt"

const logs = (await readFile(LOG_FILE, { encoding: "utf-8" })).split("\n")

const client = createClient(logsProvider(logs))

const api = client.getTypedApi(roc)

api.query.System.Account.getValue(
  "5H1Dyus4jYJSCffxw7k7eTvV3v69CD7cyw2f7qBY2FJH1Gev",
  { at: "finalized" },
).then((value) => {
  console.log(
    "I got an update on 5H1Dyus4jYJSCffxw7k7eTvV3v69CD7cyw2f7qBY2FJH1Gev",
    value,
  )
})

api.query.System.Account.watchValue(
  "5GbYjtbenzxE2YpV7tkZhdeHZs3M5h5HR8es2c2a2W3RUnpx",
  "finalized",
).forEach((value) => {
  console.log(
    "I got an update on 5GbYjtbenzxE2YpV7tkZhdeHZs3M5h5HR8es2c2a2W3RUnpx",
    value,
  )
})
