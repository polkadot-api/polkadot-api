import "./_polyfills"

import {
  LookupEntry,
  getChecksumBuilder,
  getLookupFn,
} from "@unstoppablejs/substrate-codegen"
import { V14Lookup } from "@unstoppablejs/substrate-bindings"
import { confirm, input, select } from "@inquirer/prompts"
import util from "util"
import { z } from "zod"
import { program } from "commander"
import { getMetadata } from "./metadata"
import { WellKnownChain } from "@substrate/connect"
import ora from "ora"
import { Data } from "./data"
import { outputCodegen, outputDescriptors, writeMetadataToDisk } from "./io"

const ProgramArgs = z.object({
  metadataFile: z.string().optional(),
  pkgJSONKey: z.string(),
  key: z.string(),
  file: z.string().optional(),
  interactive: z.boolean(),
})

type ProgramArgs = z.infer<typeof ProgramArgs>

program
  .name("capi")
  .description("Capi CLI")
  .option(
    "-j, --pkgJSONKey <key>",
    "key in package json for descriptor metadata",
    "polkadot-api",
  )
  .requiredOption("k --key <key>", "first key in descriptor metadata")
  .option(
    "f --file file",
    "path to descriptor metadata file; alternative to package json",
  )
  .option("-i, --interactive", "whether to run in interactive mode", false)

program.parse()

const options = ProgramArgs.parse(program.opts())

const data = await (options.key
  ? Data.fromSavedDescriptors({
      key: options.key,
      pkgJSONKey: options.pkgJSONKey,
      fileName: options.file,
    })
  : Promise.resolve(new Data()))

if (data.isInitialized && data.outputFolder && options.key) {
  await outputCodegen(data, data.outputFolder, options.key)
}

if (!options.interactive) {
  process.exit(0)
}

if (!data.isInitialized) {
  const metadataArgs = options.metadataFile
    ? {
        source: "file" as const,
        file: options.metadataFile,
      }
    : {
        source: "chain" as const,
        chain: await select({
          message: "Select a chain to pull metadata from",
          choices: [
            { name: "polkadot", value: WellKnownChain.polkadot },
            { name: "westend", value: WellKnownChain.westend2 },
            { name: "ksm", value: WellKnownChain.ksmcc3 },
            { name: "rococo", value: WellKnownChain.rococo_v2_2 },
          ],
        }),
      }

  const spinner = ora(`Loading Metadata`).start()
  const { magicNumber, metadata } = await getMetadata(metadataArgs)
  spinner.stop()

  data.setMetadata(magicNumber, metadata)
}

const metadata = data.metadata

const SELECT_DESCRIPTORS = "SELECT_DESCRIPTORS"
const SHOW_DESCRIPTORS = "SHOW_DESCRIPTORS"
const SAVE = "SAVE"
const EXIT = "EXIT"

const CONSTANTS = "CONSTANTS"
const STORAGE = "STORAGE"
const EVENTS = "EVENTS"
const ERRORS = "ERRORS"
const EXTRINSICS = "EXTRINSICS"

const { lookup, pallets } = metadata.value

const checksumBuilder = getChecksumBuilder(metadata.value)

let exit = false
while (!exit) {
  const choice = await select({
    message: "What do you want to do?",
    choices: [
      { name: "Select descriptors", value: SELECT_DESCRIPTORS },
      { name: "Show descriptors", value: SHOW_DESCRIPTORS },
      { name: "Save descriptors", value: SAVE },
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
            await data.promptCheckboxData(
              "constants",
              pallet.name,
              "Select Constants",
              pallet.constants.map((c) => [
                c.name,
                checksumBuilder.buildConstant(pallet.name, c.name)!,
              ]),
            )
            break
          }
          case STORAGE:
            await data.promptCheckboxData(
              "storage",
              pallet.name,
              "Select Storage",
              pallet.storage?.items.map((s) => [
                s.name,
                checksumBuilder.buildStorage(pallet.name, s.name)!,
              ]) ?? [],
            )
            break
          case EVENTS:
            await data.promptCheckboxData(
              "events",
              pallet.name,
              "Select Events",
              events.map((e) => [
                e,
                checksumBuilder.buildEvent(pallet.name, e)!,
              ]),
            )
            break
          case ERRORS:
            await data.promptCheckboxData(
              "errors",
              pallet.name,
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
              await data.promptExtrinsicData(
                pallet.name,
                extrinsics.map((e) => [
                  e,
                  checksumBuilder.buildCall(pallet.name, e)!,
                ]),
                Object.entries(data.descriptorData).flatMap(
                  ([pallet, { events }]) =>
                    Array.from(Object.keys(events)).map(
                      (event) => [pallet, event] as [string, string],
                    ),
                ),
                Object.entries(data.descriptorData).flatMap(
                  ([pallet, { errors }]) =>
                    Array.from(Object.keys(errors)).map(
                      (errors) => [pallet, errors] as [string, string],
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
    case SAVE: {
      const metadataFilePath = await input({
        message: "metadata file path",
      })

      const writeToPkgJSON = await confirm({
        message: "Write to package.json?",
        default: false,
      })

      const outputFolder = await input({
        message: "output folder",
      })

      await writeMetadataToDisk(data, metadataFilePath)

      const args = {
        data,
        key: options.key,
        metadataFile: metadataFilePath,
        outputFolder,
      }

      if (writeToPkgJSON) {
        await outputDescriptors({
          ...args,
          type: "package-json",
          pkgJSONKey: options.pkgJSONKey,
        })
      } else {
        const fileName = await input({
          message: "output file",
        })

        await outputDescriptors({
          ...args,
          type: "file",
          fileName,
        })
      }

      break
    }
    /*     case LOAD_DESCRIPTORS: {
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
        type: "constant" | "storage" | "event" | "error" | "extrinsic"
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
          if (checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "constant",
              name: constantName,
              oldChecksum: checksum,
              newChecksum: newChecksum,
            })
          }
        }
        for (const [storageName, checksum] of Object.entries(storage ?? {})) {
          const newChecksum = checksumBuilder.buildStorage(pallet, storageName)
          if (checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "storage",
              name: storageName,
              oldChecksum: checksum,
              newChecksum: newChecksum,
            })
          }
        }
        for (const [eventName, checksum] of Object.entries(events ?? {})) {
          const newChecksum = checksumBuilder.buildEvent(pallet, eventName)
          if (checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "event",
              name: eventName,
              oldChecksum: checksum,
              newChecksum: newChecksum,
            })
          }
        }
        for (const [errorName, checksum] of Object.entries(errors ?? {})) {
          const newChecksum = checksumBuilder.buildError(pallet, errorName)
          if (checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "error",
              name: errorName,
              oldChecksum: checksum,
              newChecksum: newChecksum,
            })
          }
        }
        for (const [callName, { checksum }] of Object.entries(
          extrinsics ?? {},
        )) {
          const newChecksum = checksumBuilder.buildCall(pallet, callName)
          if (checksum != newChecksum) {
            discrepancies.push({
              pallet,
              type: "extrinsic",
              name: callName,
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
          newChecksum === null ? chalk.red(newChecksum) : newChecksum,
      })

      console.log("-------- Constant Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "constant")
            .map(mapDiscrepancy),
        ),
      )
      console.log("")
      console.log("-------- Storage Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "storage")
            .map(mapDiscrepancy),
        ),
      )
      console.log("")
      console.log("-------- Event Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "event")
            .map(mapDiscrepancy),
        ),
      )
      console.log("")
      console.log("-------- Error Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "error")
            .map(mapDiscrepancy),
        ),
      )
      console.log("")
      console.log("-------- Extrinsic Discrepancies --------")
      console.log(
        asTable(
          discrepancies
            .filter(({ type }) => type === "extrinsic")
            .map(mapDiscrepancy),
        ),
      )
      console.log("")

      if (discrepancies.length > 0) {
        const accept = await confirm({ message: "Accept changes" })
        if (!accept) {
          break
        }
      }

      for (const discrepancy of discrepancies) {
        switch (discrepancy.type) {
          case "constant": {
            const { constants } = descriptors[discrepancy.pallet]
            if (!constants) {
              break
            }
            if (discrepancy.newChecksum === null) {
              delete constants[discrepancy.name]
            } else {
              constants[discrepancy.name] = discrepancy.newChecksum
            }
            break
          }
          case "storage": {
            const { storage } = descriptors[discrepancy.pallet]
            if (!storage) {
              break
            }
            if (discrepancy.newChecksum === null) {
              delete storage[discrepancy.name]
            } else {
              storage[discrepancy.name] = discrepancy.newChecksum
            }
            break
          }
          case "event": {
            const { events } = descriptors[discrepancy.pallet]
            if (!events) {
              break
            }
            if (discrepancy.newChecksum === null) {
              delete events[discrepancy.name]
            } else {
              events[discrepancy.name] = discrepancy.newChecksum
            }
            break
          }
          case "error": {
            const { errors } = descriptors[discrepancy.pallet]
            if (!errors) {
              break
            }
            if (discrepancy.newChecksum === null) {
              delete errors[discrepancy.name]
            } else {
              errors[discrepancy.name] = discrepancy.newChecksum
            }
            break
          }
          case "extrinsic": {
            const { extrinsics } = descriptors[discrepancy.pallet]
            if (!extrinsics) {
              break
            }
            if (discrepancy.newChecksum === null) {
              delete extrinsics[discrepancy.name]
            } else {
              const newEvents: Record<string, Set<string>> = extrinsics[
                discrepancy.name
              ].events
              for (const d of discrepancies.filter((d) => d.type === "event")) {
                newEvents[d.pallet] = newEvents[d.pallet] ?? {}
                if (d.newChecksum === null) {
                  newEvents[d.pallet].delete(d.name)
                }
              }
              const newErrors: Record<string, Set<string>> = extrinsics[
                discrepancy.name
              ].errors
              for (const d of discrepancies.filter((d) => d.type === "error")) {
                newErrors[d.pallet] = newErrors[d.pallet] ?? {}
                if (d.newChecksum === null) {
                  newErrors[d.pallet].delete(d.name)
                }
              }

              extrinsics[discrepancy.name] = {
                events: newEvents,
                errors: newErrors,
                checksum: discrepancy.newChecksum,
              }
            }
            break
          }
          default:
            break
        }
      }

      for (const pallet of Object.keys(descriptors)) {
        const palletDescriptors = descriptors[pallet]
        data.descriptorData[pallet] = data.descriptorData[pallet] ?? {}
        data.descriptorData[pallet].constants =
          palletDescriptors.constants ?? {}
        data.descriptorData[pallet].storage = palletDescriptors.storage ?? {}
        data.descriptorData[pallet].events = palletDescriptors.events ?? {}
        data.descriptorData[pallet].errors = palletDescriptors.errors ?? {}
        data.descriptorData[pallet].extrinsics =
          palletDescriptors.extrinsics ?? {}
      }
      break
    } */
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
