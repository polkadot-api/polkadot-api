import { defaultDeclarations, getTypesBuilder } from "@polkadot-api/codegen"
import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { metadata as $metadata, V15 } from "@polkadot-api/substrate-bindings"
import * as fs from "node:fs/promises"
import { getMetadata } from "./getMetadata"

const metadata = await getMetadata()
await fs.writeFile("./collectives-meta.scale", $metadata.enc(metadata))
console.log("DONE")
process.exit(0)

/*
console.log(JSON.stringify(metadata, null, 2))
process.exit(0)

if (metadata.metadata.tag !== "v14") throw new Error("wrong metadata version")

console.log("got metadata", metadata.metadata.value)

const declarations = defaultDeclarations()
const { imports, variables } = declarations
const staticBuilders = getTypesBuilder(
  declarations,
  metadata.metadata.value as V15,
  new Map(),
)
const checksumBuilders = getChecksumBuilder(metadata.metadata.value as V15)

const start = Date.now()
// this is likely the most expensive checksum that can be computed
const systemEventsChecksum = checksumBuilders.buildStorage("System", "Events")
const timeDiff = Date.now() - start
console.log({ systemEventsChecksum, timeDiff })

console.log(
  "waiting a couple of seconds before computing the ts-code needed for using the storage entry: System.Events",
)
await new Promise((res) => setTimeout(res, 2_000))

console.log("let's print that code!")
await new Promise((res) => setTimeout(res, 500))

const exportedVars = staticBuilders.buildStorage("System", "Events")

const constDeclarations = [...variables.values()].map(
  (variable) =>
    `${
      variable.name === exportedVars.key || variable.name === exportedVars.val
        ? "export "
        : ""
    }const ${variable.name}${variable.type ? ": " + variable.type : ""} = ${
      variable.checksum
    };`,
)
constDeclarations.unshift(
  `import {${[...imports].join(", ")}} from "@polkadot-api/substrate-binding";`,
)

console.log(constDeclarations.join("\n\n"))
*/
