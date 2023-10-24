import {
  CodeDeclarations,
  getChecksumBuilder,
  getStaticBuilder,
} from "@polkadot-api/substrate-codegen"
import { getMetadata } from "./getMetadata"
import { writeFile } from "fs"
import * as fs from "node:fs/promises"
import { metadata as $metadata } from "@polkadot-api/substrate-bindings"

const metadata = await getMetadata()
await fs.writeFile("./collectives-meta.scale", $metadata.enc(metadata))
console.log("DONE")
process.exit(0)

/*
console.log(JSON.stringify(metadata, null, 2))
process.exit(0)

if (metadata.metadata.tag !== "v14") throw new Error("wrong metadata version")

console.log("got metadata", metadata.metadata.value)

const declarations: CodeDeclarations = {
  imports: new Set(),
  variables: new Map(),
}
const { imports, variables } = declarations
const staticBuilders = getStaticBuilder(metadata.metadata.value, declarations)
const checksumBuilders = getChecksumBuilder(metadata.metadata.value)

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
      variable.id === exportedVars.key || variable.id === exportedVars.val
        ? "export "
        : ""
    }const ${variable.id}${variable.types ? ": " + variable.types : ""} = ${
      variable.value
    };`,
)
constDeclarations.unshift(
  `import {${[...imports].join(", ")}} from "@polkadot-api/substrate-binding";`,
)

console.log(constDeclarations.join("\n\n"))
*/
