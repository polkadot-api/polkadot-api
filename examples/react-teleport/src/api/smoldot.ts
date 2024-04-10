import SmWorker from "polkadot-api/smoldot/worker?worker"
import { startFromWorker } from "polkadot-api/smoldot/from-worker"

export const smoldot = startFromWorker(new SmWorker())
