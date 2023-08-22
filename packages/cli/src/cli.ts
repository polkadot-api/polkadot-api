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
import { ExtrinsicData } from "./ExtrinsicData"
import { confirm } from "@inquirer/prompts"
import util from "util"
import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"

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
    extrinsics: ExtrinsicData
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
    case SELECT_DESCRIPTORS: {
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
          extrinsics: new ExtrinsicData(),
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
          case EXTRINSICS: {
            let selectExtrinsics = true
            while (selectExtrinsics) {
              const a = Object.values(data).flatMap(({ events }) =>
                Array.from(events.data).map(
                  (event) => [pallet.name, event] as [string, string],
                ),
              )

              await data[pallet.name].extrinsics.prompt(
                extrinsics,
                Object.values(data).flatMap(({ events }) =>
                  Array.from(events.data).map(
                    (event) => [pallet.name, event] as [string, string],
                  ),
                ),
                Object.values(data).flatMap(({ errors }) =>
                  Array.from(errors.data).map(
                    (errors) => [pallet.name, errors] as [string, string],
                  ),
                ),
              )
              selectExtrinsics = await confirm({
                message: "Continue?",
                default: true,
              })
            }
            break
          }
          case EXIT:
            exitDescriptorSelection = true
            break
          default:
            break
        }
      }
      break
    }
    case SHOW_DESCRIPTORS: {
      console.log(
        util.inspect(data, { showHidden: false, depth: null, colors: true }),
      )
      break
    }
    case OUTPUT_CODEGEN: {
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

      const eventDescriptors: Record<
        string,
        [pallet: string, name: string, checksum: bigint, payload: string]
      > = {}

      const callDescriptors: [
        pallet: string,
        callName: string,
        checksum: bigint,
        payload: string,
        events: ReadonlyRecord<string, ReadonlySet<string>>,
        errors: ReadonlyRecord<string, ReadonlySet<string>>,
      ][] = []

      for (const [
        pallet,
        { constants, storage, events, extrinsics },
      ] of Object.entries(data)) {
        for (const constantName of constants.data) {
          const payload = buildConstant(pallet, constantName)
          const checksum = checksumBuilder.buildConstant(pallet, constantName)!
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
          eventDescriptors[`${pallet}${eventName}`] = [
            pallet,
            eventName,
            checksum,
            payload,
          ]
        }
        for (const [callName, { events, errors }] of Object.entries(
          extrinsics.data,
        )) {
          const payload = buildCall(pallet, callName)
          const checksum = checksumBuilder.buildCall(pallet, callName)!
          callDescriptors.push([
            pallet,
            callName,
            checksum,
            payload,
            events,
            errors,
          ])
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
      await fs.writeFile(`codegen/descriptors.ts`, DESCRIPTOR_SPEC)
      const tsc = deferred<number>()
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
        tsc.resolve(code ?? 1)
      })

      await tsc

      await fs.rm(`codegen/${outFile}`)

      let descriptorCodegen = ""
      const descriptorTypeImports = [
        "DescriptorCommon",
        "ArgsWithPayloadCodec",
        "StorageDescriptor",
        "ConstantDescriptor",
        "EventDescriptor",
        "ErrorDescriptor",
        "EventToObject",
        "UnionizeTupleEvents",
        "TxDescriptorArgs",
        "TxDescriptorEvents",
        "TxDescriptorErrors",
        "TxFunction",
      ]
      const descriptorImports = [
        "createCommonDescriptor",
        "getDescriptorCreator",
        "getPalletCreator",
      ]

      descriptorCodegen += `import {${[...declarations.imports].join(
        ", ",
      )}} from "@unstoppablejs/substrate-bindings"\n`
      descriptorCodegen += `import type {${[...descriptorTypeImports].join(
        ", ",
      )}} from "./descriptors"\n`
      descriptorCodegen += `import {${[...descriptorImports].join(
        ", ",
      )}} from "./descriptors"\n`
      descriptorCodegen += `import type {${[...declarations.variables.values()]
        .map((v) => v.id)
        .join(", ")}} from "./codegen"\n\n`

      for (const pallet of Object.keys(data)) {
        descriptorCodegen += `const ${pallet}Creator = getPalletCreator(\"${pallet}\")\n\n`
        descriptorCodegen += `const CONST = "const"\n\n`
        descriptorCodegen += `const EVENT = "event"\n\n`
        /*   
        if (Object.keys(data[pallet].extrinsics.data).length > 0) {
          descriptorCodegen += `const ${pallet}Call = { type: \"tx\", pallet: \"${pallet}\"} as const\n\n`
        } */
      }

      descriptorCodegen +=
        constantDescriptors
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}${name}Constant = ${pallet}Creator.getPayloadDescriptor(CONST, ${checksum}n, \"${name}\", {} as ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              })`,
          )
          .join("\n\n") + "\n"
      descriptorCodegen +=
        storageDescriptors
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}${name}Storage = ${pallet}Creator.getStorageDescriptor(${checksum}n, \"${name}\", {} as ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              })`,
          )
          .join("\n\n") + "\n"
      descriptorCodegen +=
        Object.values(eventDescriptors)
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}${name}Event = ${pallet}Creator.getPayloadDescriptor(EVENT, ${checksum}n, \"${name}\", {} as ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              })`,
          )
          .join("\n\n") + "\n"

      /*
      descriptorCodegen +=
        "const inferEventDescriptorTuple = <A extends Array<EventDescriptor<any, any>>>(...args: A): A => args;"
      descriptorCodegen +=
        "const inferStringTuple = <A extends Array<string>>(...args: A): A => args;"

      for (const [
        pallet,
        name,
        checksum,
        payload,
        events,
        errors,
      ] of callDescriptors) {
        const eventVariables = Object.entries(events).reduce(
          (p, [pallet, palletEvents]) => [
            ...p,
            ...Array.from(palletEvents).map((e) => `${pallet}${e}`),
          ],
          [] as string[],
        )
        const errorVariables = Object.entries(events).reduce(
          (p, [_, palletEvents]) => [
            ...p,
            // ...Array.from(palletEvents).map((e) => `${pallet}${e}`),
            ...Array.from(palletEvents).map((e) => `${e}`),
          ],
          [] as string[],
        )

        descriptorCodegen +=
          `const ${name}Events = inferEventDescriptorTuple(${[...eventVariables]
            .map((name) => `${pallet}${name}Event`)
            .join(",")})` + "\n\n"
        descriptorCodegen +=
          `const ${name}Errors = inferStringTuple(${[...errorVariables]
            .map((e) => `\"${e}\"`)
            .join(",")})` + "\n\n"
        descriptorCodegen +=
          `export const ${pallet}${name}Call: CallDescriptor<${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          }, typeof ${name}Events, typeof ${name}Errors> = { ...${pallet}Call, name: \"${name}\", checksum: ${checksum}n, events: ${name}Events, errors: ${name}Errors}` +
          "\n\n"
      } */

      await fs.writeFile(`codegen/descriptor_codegen.ts`, descriptorCodegen)
      break
    }
    case EXIT:
      exit = true
      break
    default:
      break
  }
}

function getLookupEntry(lookup: V14Lookup, idx: number) {
  const lookupFns = getLookupFn(lookup)(idx)
  assertLookupEntryIsEnum(lookupFns)

  return Object.keys(lookupFns.value)
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}

function assertLookupEntryIsEnum(
  lookupEntry: LookupEntry,
): asserts lookupEntry is LookupEntry & { type: "enum" } {
  if (lookupEntry.type !== "enum") {
    throw new Error("not an enum")
  }
}
