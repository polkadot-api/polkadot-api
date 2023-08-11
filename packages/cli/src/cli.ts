import { input, select } from "@inquirer/prompts"
import * as fs from "node:fs/promises"
import {
  LookupEntry,
  getChecksumBuilder,
  getLookupFn,
  getStaticBuilder,
} from "@unstoppablejs/substrate-codegen"
import {
  metadata as $metadata,
  V14Lookup,
} from "@unstoppablejs/substrate-bindings"
import { CheckboxData } from "./CheckboxData"
import * as childProcess from "node:child_process"
import { deferred } from "./deferred"
import { DESCRIPTOR_SPEC } from "./descriptors"

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

        const checksumBuilder = getChecksumBuilder(metadata.value)

        const constantDescriptors: [
          pallet: string,
          name: string,
          checksum: bigint,
          payload: string,
        ][] = []

        const storageDescriptors: [
          pallet: string,
          name: string,
          checksum: bigint,
          key: string,
          val: string,
        ][] = []

        const eventDescriptors: [
          pallet: string,
          name: string,
          checksum: bigint,
          payload: string,
        ][] = []

        for (const [
          pallet,
          { constants, storage, events, extrinsics },
        ] of Object.entries(data)) {
          for (const constantName of constants.data) {
            const payload = buildConstant(pallet, constantName)
            const checksum = checksumBuilder.buildConstant(
              pallet,
              constantName,
            )!
            constantDescriptors.push([pallet, constantName, checksum, payload])
          }
          for (const entry of storage.data) {
            const { key, val } = buildStorage(pallet, entry)
            const checksum = checksumBuilder.buildStorage(pallet, entry)!
            storageDescriptors.push([pallet, entry, checksum, key, val])
          }
          for (const eventName of events.data) {
            const payload = buildEvent(pallet, eventName)
            const checksum = checksumBuilder.buildEvent(pallet, eventName)!
            eventDescriptors.push([pallet, eventName, checksum, payload])
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
        declarations.imports.add("CodecType")
        declarations.imports.add("Codec")
        constDeclarations.unshift(
          `import {${[...declarations.imports].join(
            ", ",
          )}} from "@unstoppablejs/substrate-bindings"`,
        )

        await fs.mkdir("codegen", { recursive: true })
        await fs.writeFile(`codegen/${outFile}`, constDeclarations.join("\n\n"))
        await fs.writeFile(`codegen/descriptors.d.ts`, DESCRIPTOR_SPEC)
        const tsc = deferred()
        const process = childProcess.spawn("tsc", [
          `codegen/${outFile}`,
          "--outDir",
          "./codegen",
          "--skipLibCheck",
          "--emitDeclarationOnly",
          "--declaration",
        ])

        process.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`)
        })

        process.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`)
        })

        process.on("close", (code) => {
          console.log("code", code)
          tsc.resolve(code)
        })

        await tsc

        await fs.rm(`codegen/${outFile}`)

        let descriptorCodegen = ""
        const descriptorImports = [
          "StorageDescriptor",
          "ConstantDescriptor",
          "EventDescriptor",
          "CallDescriptor",
          "Descriptor",
          "EventToObject",
          "UnionizeTupleEvents",
          "CallDescriptorArgs",
          "CallDescriptorEvents",
          "CallDescriptorErrors",
          "CallFunction",
        ]

        descriptorCodegen += `import {${[...declarations.imports].join(
          ", ",
        )}} from "@unstoppablejs/substrate-bindings"\n`
        descriptorCodegen += `import type {${[...descriptorImports].join(
          ", ",
        )}} from "./descriptors"\n`
        descriptorCodegen += `import type {${[
          ...declarations.variables.values(),
        ]
          .map((v) => v.id)
          .join(", ")}} from "./codegen"\n\n`

        descriptorCodegen += constantDescriptors
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}_${name}_constant: ConstantDescriptor<${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              }> = { type: "const", pallet: \"${pallet}\", name: \"${name}\", checksum: ${checksum}n}`,
          )
          .join("\n")

        descriptorCodegen += storageDescriptors
          .map(
            ([pallet, name, checksum, key, value]) =>
              `export const ${pallet}_${name}_storage: StorageDescriptor<${
                declarations.imports.has(key) ? `CodecType<typeof ${key}>` : key
              }, ${
                declarations.imports.has(value)
                  ? `CodecType<typeof ${value}>`
                  : value
              }> = { type: "storage", pallet: \"${pallet}\", name: \"${name}\", checksum: ${checksum}n}`,
          )
          .join("\n")
        descriptorCodegen += eventDescriptors
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}_${name}_event: EventDescriptor<\"${name}\", ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              }> = { type: "event", pallet: \"${pallet}\", name: \"${name}\", checksum: ${checksum}n}`,
          )
          .join("\n")

        await fs.writeFile(`codegen/descriptor_codegen.ts`, descriptorCodegen)
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
