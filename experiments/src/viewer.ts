import { getViewBuilder } from "@polkadot-api/substrate-codegen"
import { readFile } from "node:fs/promises"
import { v14 } from "@polkadot-api/substrate-bindings"

const metadataBytes = await readFile("./ksm.scale")
const metadata = v14.dec(metadataBytes)

const { callDecoder } = getViewBuilder(metadata)
const result = callDecoder(
  "0x17002b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000",
)

console.log(
  JSON.stringify(
    result.args,
    (key, value) => {
      return key === "shape" ? undefined : value
    },
    2,
  ),
)
