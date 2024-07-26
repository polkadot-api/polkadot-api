import * as smoldot from "smoldot/worker"
import { compileBytecode } from "smoldot/bytecode"
import { parentPort } from "node:worker_threads"

compileBytecode().then((x) => parentPort!.postMessage(x))

parentPort!.on("message", (msg) => smoldot.run(msg))
