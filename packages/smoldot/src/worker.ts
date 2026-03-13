import * as smoldot from "@polkadot-api/smoldot-patch/worker"
import { compileBytecode } from "@polkadot-api/smoldot-patch/bytecode"

compileBytecode().then((x) => {
  postMessage(x)
})
onmessage = (msg) => smoldot.run(msg.data)
