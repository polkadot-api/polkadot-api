import { withLegacy } from "@polkadot-api/legacy-provider"
import { getWsProvider } from "polkadot-api/ws-provider"
import { withLogs } from "./with-logs"
import { createClient } from "polkadot-api"
import { distinctUntilChanged, map } from "rxjs"

const ZOMBIENET_URI = "wss://sys.ibp.network/statemine"
const timeStamp = Date.now()
const client = createClient(
  withLogs(
    `outter_logs${timeStamp}.txt`,
    getWsProvider(ZOMBIENET_URI, {
      innerEnhancer: (x) =>
        withLegacy()(withLogs(`inner_logs${timeStamp}.txt`, x)),
    }),
  ),
)

console.log({ timeStamp })
client.finalizedBlock$.subscribe(
  (x) => console.log("fin:" + x.number),
  console.error,
)
client.bestBlocks$
  .pipe(
    map((bests) => bests[0]),
    distinctUntilChanged((a, b) => a.hash === b.hash),
  )
  .subscribe((x) => console.log(`best(${x.hash}): ${x.number}`), console.error)
