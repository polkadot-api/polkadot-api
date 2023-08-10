import { input, select } from "@inquirer/prompts"
import * as fs from "node:fs/promises"
import {
  LookupEntry,
  getLookupFn,
  getStaticBuilder,
} from "@unstoppablejs/substrate-codegen"
import {
  metadata as $metadata,
  V14Lookup,
} from "@unstoppablejs/substrate-bindings"
import { CheckboxData } from "./CheckboxData"
import ts from "typescript"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

const metadataPath = await input({
  message: "Enter path to metadata file",
  default: "metadata.scale",
})
const rawMetadata = await fs.readFile(metadataPath)
const { metadata } = $metadata.dec(rawMetadata)

assertIsv14(metadata)

const SELECT_DESCRIPTORS = "SELECT_DESCRIPTORS"
const SHOW_DESCRIPTORS = "SHOW_DESCRIPTORS"
const OUTPUT_CODEGEN = "OUTPUT_CODEGEN"
const EXIT = "EXIT"

const CONSTANTS = "CONSTANTS"
const STORAGE = "STORAGE"
const EVENTS = "EVENTS"
const ERRORS = "ERRORS"
const EXTRINSICS = "EXTRINSICS"

const data: Record<
  string,
  {
    constants: CheckboxData
    storage: CheckboxData
    events: CheckboxData
    errors: CheckboxData
    extrinsics: CheckboxData
  }
> = {}
const { lookup, pallets } = metadata.value
await fs.writeFile("metadata.json", JSON.stringify(metadata.value))

let exit = false
while (!exit) {
  const choice = await select({
    message: "What do you want to do?",
    choices: [
      { name: "Select descriptors", value: SELECT_DESCRIPTORS },
      { name: "Show descriptors", value: SHOW_DESCRIPTORS },
      { name: "Output Codegen", value: OUTPUT_CODEGEN },
      { name: "Exit", value: EXIT },
    ],
  })

  switch (choice) {
    case SELECT_DESCRIPTORS:
      const pallet = await select({
        message: "Select a pallet",
        choices: pallets.map((p) => ({ name: p.name, value: p })),
      })

      const events = getLookupEntry(lookup, Number(pallet.events))
      const errors = getLookupEntry(lookup, Number(pallet.errors))
      const extrinsics = getLookupEntry(lookup, Number(pallet.calls))

      if (!data[pallet.name]) {
        data[pallet.name] = {
          constants: new CheckboxData(),
          storage: new CheckboxData(),
          events: new CheckboxData(),
          errors: new CheckboxData(),
          extrinsics: new CheckboxData(),
        }
      }

      let exitDescriptorSelection = false
      while (!exitDescriptorSelection) {
        const descriptorType = await select({
          message: "Select a descriptor type",
          choices: [
            { name: "Constants", value: CONSTANTS },
            { name: "Storage", value: STORAGE },
            { name: "Events", value: EVENTS },
            { name: "Errors", value: ERRORS },
            { name: "Extrinsics", value: EXTRINSICS },
            { name: "Exit", value: EXIT },
          ],
        })
        switch (descriptorType) {
          case CONSTANTS:
            await data[pallet.name].constants.prompt(
              "Select Constants",
              pallet.constants.map((c) => c.name),
            )
            break
          case STORAGE:
            await data[pallet.name].storage.prompt(
              "Select Storage",
              pallet.storage?.items.map((s) => s.name) ?? [],
            )
            break
          case EVENTS:
            await data[pallet.name].events.prompt("Select Events", events)
            break
          case ERRORS:
            await data[pallet.name].errors.prompt("Select Errors", errors)
            break
          case EXTRINSICS:
            await data[pallet.name].extrinsics.prompt(
              "Select Extrinsics",
              extrinsics,
            )
            break
          case EXIT:
            exitDescriptorSelection = true
            break
          default:
            break
        }
      }
      break
    case SHOW_DESCRIPTORS:
      console.log(data)
      break
    case OUTPUT_CODEGEN:
      {
        const outFile = await input({
          message: "Enter output fileName",
          default: "codegen.ts",
        })

        const declarations = {
          imports: new Set<string>(),
          variables: new Map(),
        }

        const { buildStorage, buildEvent, buildCall, buildConstant } =
          getStaticBuilder(metadata.value, declarations)

        for (const [
          pallet,
          { constants, storage, events, extrinsics },
        ] of Object.entries(data)) {
          for (const constantName of constants.data) {
            buildConstant(pallet, constantName)
          }
          for (const entry of storage.data) {
            buildStorage(pallet, entry)
          }
          for (const eventName of events.data) {
            buildEvent(pallet, eventName)
          }
          for (const callName of extrinsics.data) {
            buildCall(pallet, callName)
          }
        }

        const constDeclarations = [...declarations.variables.values()].map(
          (variable) =>
            `const ${variable.id}${
              variable.types ? ": " + variable.types : ""
            } = ${variable.value}\nexport type ${
              variable.id
            } = CodecType<typeof ${variable.id}>`,
        )
        constDeclarations.unshift(
          `import {${[...declarations.imports].join(
            ", ",
          )}} from "@unstoppablejs/substrate-bindings"`,
        )

        await fs.writeFile(`${outFile}`, constDeclarations.join("\n\n"))
      }
      break
    case EXIT:
      exit = true
      break
    default:
      break
  }
}

function getLookupEntry(lookup: V14Lookup, idx: number) {
  const lookupFns = getLookupFn(lookup)(idx)
  assertIsEnum(lookupFns)

  return Object.keys(lookupFns.value)
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}

function assertIsEnum(
  metadata: LookupEntry,
): asserts metadata is LookupEntry & { type: "enum" } {
  if (metadata.type !== "enum") {
    throw new Error("not an enum")
  }
}
