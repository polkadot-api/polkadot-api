import { createWsClient } from "polkadot-api/ws"
import { distinctUntilChanged, map } from "rxjs"

const ZOMBIENET_URI = "wss://sys.ibp.network/statemine"
const timeStamp = Date.now()
const client = createWsClient(ZOMBIENET_URI)

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
