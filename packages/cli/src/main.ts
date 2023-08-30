import "./_polyfills"

import * as fs from "node:fs/promises"
import {
  LookupEntry,
  getChecksumBuilder,
  getLookupFn,
  getStaticBuilder,
} from "@unstoppablejs/substrate-codegen"
import { V14Lookup } from "@unstoppablejs/substrate-bindings"
import { CheckboxData } from "./CheckboxData"
import * as childProcess from "node:child_process"
import { deferred } from "./deferred"
import { DESCRIPTOR_SPEC } from "./descriptors"
import { ExtrinsicData } from "./ExtrinsicData"
import { confirm, input, select } from "@inquirer/prompts"
import util from "util"
import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import * as writePkg from "write-pkg"
import { z } from "zod"
import descriptorSchema from "./descriptor-schema"
import fsExists from "fs.promises.exists"
import { program } from "commander"
import { GetMetadataArgs, getMetadata } from "./metadata"
import { WellKnownChain } from "@substrate/connect"
import ora from "ora"
import { blowupMetadata } from "./testing"
import asTable from "as-table"
import chalk from "chalk"
import * as Record from "fp-ts/lib/Record"

const ProgramArgs = z.object({
  metadata: z.string().optional(),
  interactive: z.boolean(),
})

type ProgramArgs = z.infer<typeof ProgramArgs>

program
  .name("capi")
  .description("Capi CLI")
  .option("-m, --metadata <path>", "path to scale encoded metadata file")
  .option("-i, --interactive", "whether to run in interactive mode", false)

program.parse()

const options = ProgramArgs.parse(program.opts())

const metadataArgs = await getMetadataArgs(options.metadata)
const spinner = ora(`Loading Metadata`).start()
const metadata = await getMetadata(metadataArgs)
spinner.stop()

const SELECT_DESCRIPTORS = "SELECT_DESCRIPTORS"
const SHOW_DESCRIPTORS = "SHOW_DESCRIPTORS"
const OUTPUT_CODEGEN = "OUTPUT_CODEGEN"
const OUTPUT_DESCRIPTORS = "OUTPUT_DESCRIPTORS"
const LOAD_DESCRIPTORS = "LOAD_DESCRIPTORS"
const BLOWUP_METADATA = "BLOWUP_METADATA"
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

const checksumBuilder = getChecksumBuilder(metadata.value)

let exit = false
while (!exit) {
  const choice = await select({
    message: "What do you want to do?",
    choices: [
      { name: "Select descriptors", value: SELECT_DESCRIPTORS },
      { name: "Show descriptors", value: SHOW_DESCRIPTORS },
      { name: "Output Descriptors", value: OUTPUT_DESCRIPTORS },
      { name: "Load Descriptors", value: LOAD_DESCRIPTORS },
      { name: "Blowup Metadata", value: BLOWUP_METADATA },
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
          case CONSTANTS: {
            await data[pallet.name].constants.prompt(
              "Select Constants",
              pallet.constants.map((c) => [
                c.name,
                checksumBuilder.buildConstant(pallet.name, c.name)!,
              ]),
            )
            break
          }
          case STORAGE:
            await data[pallet.name].storage.prompt(
              "Select Storage",
              pallet.storage?.items.map((s) => [
                s.name,
                checksumBuilder.buildStorage(pallet.name, s.name)!,
              ]) ?? [],
            )
            break
          case EVENTS:
            await data[pallet.name].events.prompt(
              "Select Events",
              events.map((e) => [
                e,
                checksumBuilder.buildEvent(pallet.name, e)!,
              ]),
            )
            break
          case ERRORS:
            await data[pallet.name].errors.prompt(
              "Select Errors",
              errors.map((e) => [
                e,
                checksumBuilder.buildError(pallet.name, e)!,
              ]),
            )
            break
          case EXTRINSICS: {
            let selectExtrinsics = true
            while (selectExtrinsics) {
              await data[pallet.name].extrinsics.prompt(
                extrinsics.map((e) => [
                  e,
                  checksumBuilder.buildCall(pallet.name, e)!,
                ]),
                Object.values(data).flatMap(({ events }) =>
                  Array.from(Object.keys(events.data)).map(
                    (event) => [pallet.name, event] as [string, string],
                  ),
                ),
                Object.values(data).flatMap(({ errors }) =>
                  Array.from(Object.keys(errors.data)).map(
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
    case BLOWUP_METADATA: {
      blowupMetadata(metadata)
      break
    }
    case SHOW_DESCRIPTORS: {
      console.log(
        util.inspect(data, { showHidden: false, depth: null, colors: true }),
      )
      break
    }
    case OUTPUT_DESCRIPTORS: {
      const output = JSON.stringify(data, null, 2)

      const writeToPkgJSON = await confirm({
        message: "Write to package.json?",
        default: false,
      })

      if (writeToPkgJSON) {
        writePkg.updatePackage(
          JSON.parse(JSON.stringify({ capi: { descriptors: data } })),
        )
      } else {
        const outFile = await input({
          message: "Enter output fileName",
          default: "descriptors.json",
        })

        await fs.writeFile(outFile, output)
      }
      break
    }
    case LOAD_DESCRIPTORS: {
      const descriptors = await (async () => {
        if (await fsExists("package.json")) {
          const pkgJSONSchema = z.object({
            capi: z.object({ descriptors: descriptorSchema }).optional(),
          })

          const { capi } = await pkgJSONSchema.parseAsync(
            JSON.parse(
              await fs.readFile("package.json", { encoding: "utf-8" }),
            ),
          )

          if (capi) {
            return capi.descriptors
          }
        }

        const inFile = await input({
          message: "Enter descriptors fileName",
          default: "descriptors.json",
        })

        return descriptorSchema.parseAsync(
          JSON.parse(await fs.readFile(inFile, { encoding: "utf-8" })),
        )
      })()

      const discrepancies: Array<{
        pallet: string
        type: "constant" | "storage"
        name: string
        oldChecksum: bigint | null
        newChecksum: bigint | null
      }> = []

      for (const [
        pallet,
        { constants, storage, events, errors, extrinsics },
      ] of Object.entries(descriptors)) {
        for (const [constantName, checksum] of Object.entries(
          constants ?? {},
        )) {
          const newChecksum = checksumBuilder.buildConstant(
            pallet,
            constantName,
          )
          if (newChecksum === null || checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "constant",
              name: constantName,
              oldChecksum: checksum,
              newChecksum: newChecksum,
            })
          }
        }
      }

      const mapDiscrepancy = ({
        pallet,
        name,
        oldChecksum,
        newChecksum,
      }: (typeof discrepancies)[number]) => ({
        Pallet: pallet,
        Name: name,
        "Old Checksum":
          oldChecksum === null ? chalk.red(oldChecksum) : oldChecksum,
        "New Checksum":
          newChecksum !== oldChecksum
            ? chalk.magenta(newChecksum)
            : newChecksum === null
            ? chalk.red(newChecksum)
            : newChecksum,
      })

      console.log("-------- Constant Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "constant")
            .map(mapDiscrepancy),
        ),
      )
      console.log("--------------------------------------")

      if (discrepancies.length > 0) {
        const accept = await confirm({ message: "Accept changes" })
        if (!accept) {
          break
        }
      }

      for (const discrepancy of discrepancies) {
        if (discrepancy.newChecksum === null) {
          switch (discrepancy.type) {
            case "constant": {
              const constants = descriptors[discrepancy.pallet].constants
              if (constants) {
                delete constants[discrepancy.name]
              }
              break
            }
            default:
              break
          }
        }
      }

      for (const pallet of Object.keys(descriptors)) {
        const palletDescriptors = descriptors[pallet]
        data[pallet] = data[pallet] ?? {}
        data[pallet].constants = new CheckboxData(palletDescriptors.constants)
        data[pallet].storage = new CheckboxData(palletDescriptors.storage)
        data[pallet].events = new CheckboxData(palletDescriptors.events)
        data[pallet].errors = new CheckboxData(palletDescriptors.errors)
        data[pallet].extrinsics = new ExtrinsicData(
          palletDescriptors.extrinsics,
        )
      }
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

      const { buildStorage, buildEvent, buildCall, buildConstant, buildError } =
        getStaticBuilder(metadata.value, declarations)

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
      const errorDescriptors: Record<
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
        { constants, storage, events, extrinsics, errors },
      ] of Object.entries(data)) {
        for (const [constantName, checksum] of Object.entries(constants.data)) {
          const payload = buildConstant(pallet, constantName)
          constantDescriptors.push([pallet, constantName, checksum, payload])
        }
        for (const [entry, checksum] of Object.entries(storage.data)) {
          const { key, val } = buildStorage(pallet, entry)
          storageDescriptors.push([pallet, entry, checksum, key, val])
        }
        for (const [eventName, checksum] of Object.entries(events.data)) {
          const payload = buildEvent(pallet, eventName)
          eventDescriptors[`${pallet}${eventName}`] = [
            pallet,
            eventName,
            checksum,
            payload,
          ]
        }
        for (const [errorName, checksum] of Object.entries(errors.data)) {
          const payload = buildError(pallet, errorName)
          errorDescriptors[`${pallet}${errorName}`] = [
            pallet,
            errorName,
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

      descriptorCodegen += `const CONST = "const"\n\n`
      descriptorCodegen += `const EVENT = "event"\n\n`
      descriptorCodegen += `const ERROR = "error"\n\n`

      for (const pallet of Object.keys(data)) {
        descriptorCodegen += `const ${pallet}Creator = getPalletCreator(\"${pallet}\")\n\n`
      }

      descriptorCodegen +=
        constantDescriptors
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}${name}Constant = ${pallet}Creator.getPayloadDescriptor(CONST, ${checksum}n, \"${name}\", {} as unknown as ${
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
              `export const ${pallet}${name}Storage = ${pallet}Creator.getStorageDescriptor(${checksum}n, \"${name}\", {} as unknown as ${
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
              `export const ${pallet}${name}Event = ${pallet}Creator.getPayloadDescriptor(EVENT, ${checksum}n, \"${name}\", {} as unknown as ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              })`,
          )
          .join("\n\n") + "\n"
      descriptorCodegen +=
        Object.values(errorDescriptors)
          .map(
            ([pallet, name, checksum, payload]) =>
              `export const ${pallet}${name}Error = ${pallet}Creator.getPayloadDescriptor(ERROR, ${checksum}n, \"${name}\", {} as unknown as ${
                declarations.imports.has(payload)
                  ? `CodecType<typeof ${payload}>`
                  : payload
              })`,
          )
          .join("\n\n") + "\n"

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
            ...Array.from(palletEvents).map((e) => `${pallet}${e}Event`),
          ],
          [] as string[],
        )
        const errorVariables = Object.entries(errors).reduce(
          (p, [_, palletEvents]) => [
            ...p,
            ...Array.from(palletEvents).map((e) => `${pallet}${e}Error`),
          ],
          [] as string[],
        )

        descriptorCodegen +=
          `export const ${pallet}${name}Call = ${pallet}Creator.getTxDescriptor(${checksum}n, "${name}", [${eventVariables.join(
            ",",
          )}], [${errorVariables.join(",")}], {} as unknown as ${
            declarations.imports.has(payload)
              ? `CodecType<typeof ${payload}>`
              : payload
          })` + "\n\n"
      }

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

function assertLookupEntryIsEnum(
  lookupEntry: LookupEntry,
): asserts lookupEntry is LookupEntry & { type: "enum" } {
  if (lookupEntry.type !== "enum") {
    throw new Error("not an enum")
  }
}

async function getMetadataArgs(
  metadataFile: ProgramArgs["metadata"],
): Promise<GetMetadataArgs> {
  if (metadataFile) {
    return {
      source: "file",
      file: metadataFile,
    }
  }

  const chain = await select({
    message: "Select a chain to pull metadata from",
    choices: [
      { name: "polkadot", value: WellKnownChain.polkadot },
      { name: "westend", value: WellKnownChain.westend2 },
      { name: "ksm", value: WellKnownChain.ksmcc3 },
      { name: "rococo", value: WellKnownChain.rococo_v2_2 },
    ],
  })

  return {
    source: "chain",
    chain,
  }
}
