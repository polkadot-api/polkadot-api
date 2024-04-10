import * as smoldot from "smoldot/worker"
import { compileBytecode } from "smoldot/bytecode"

compileBytecode().then((x) => {
  console.log("compiled code", x)
  postMessage(x)
})
onmessage = (msg) => smoldot.run(msg.data)
