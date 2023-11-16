#!/usr/bin/env node

import "./_polyfills"

import {
  LookupEntry,
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/substrate-codegen"
import { V14Lookup } from "@polkadot-api/substrate-bindings"
import { confirm, input, select } from "@inquirer/prompts"
import util from "util"
import { z } from "zod"
import { program } from "commander"
import { getMetadata } from "./metadata"
import { WellKnownChain } from "@substrate/connect"
import ora from "ora"
import { Data } from "./data"
import {
  outputCodegen,
  outputDescriptors,
  readDescriptors,
  writeMetadataToDisk,
} from "./io"
import {
  checkDescriptorsForDiscrepancies,
  showDiscrepancies,
  synchronizeDescriptors,
} from "./sync"
import { blowupMetadata } from "./testing"
import { runWithEscapeKeyHandler } from "./keyboard"

const ProgramArgs = z.object({
  metadataFile: z.string().optional(),
  pkgJSONKey: z.string(),
  key: z.string().optional(),
  file: z.string().optional(),
  interactive: z.boolean(),
  sync: z.boolean(),
})

type ProgramArgs = z.infer<typeof ProgramArgs>

program
  .name("polkadot-api")
  .description("Polkadot API CLI")
  .option(
    "-j, --pkgJSONKey <key>",
    "key in package json for descriptor metadata",
    "polkadot-api",
  )
  .option("k --key <key>", "first key in descriptor metadata")
  .option(
    "f --file <file>",
    "path to descriptor metadata file; alternative to package json",
  )
  .option("s --sync", "synchronize", false)
  .option("-i, --interactive", "whether to run in interactive mode", false)

program.parse()

const options = ProgramArgs.parse(program.opts())

const descriptorMetadata = await readDescriptors({
  pkgJSONKey: options.pkgJSONKey,
  fileName: options.file,
})

let areThereDescriptorDependencies = false

if (descriptorMetadata && !options.interactive) {
  for (const key of Object.keys(descriptorMetadata)) {
    const data = await Data.fromSavedDescriptors(descriptorMetadata[key])

    if (data.isInitialized && data.outputFolder) {
      const discrepancies = checkDescriptorsForDiscrepancies(data)

      if (options.sync) {
        synchronizeDescriptors(data, discrepancies)
      } else if (discrepancies.length > 0) {
        console.log(`-------- ${key} Discrepancies Start --------`)
        showDiscrepancies(discrepancies)
        console.log(`-------- ${key} Discrepancies End --------`)
        areThereDescriptorDependencies = true
      }
      if (!options.interactive && !areThereDescriptorDependencies) {
        await outputCodegen(
          data.descriptorData,
          data.metadata.value,
          data.outputFolder,
          key,
        )
      }
    }
  }
}

if (areThereDescriptorDependencies) {
  process.exit(1)
}

if (!options.interactive) {
  process.exit(0)
}

const data = await (descriptorMetadata &&
options.key &&
descriptorMetadata[options.key]
  ? Data.fromSavedDescriptors(descriptorMetadata[options.key])
  : Promise.resolve(new Data()))

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
const SYNC = "SYNC"
const SAVE = "SAVE"
const DELETE_METADATA = "DELETE_METADATA"
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
      { name: "Synchronize descriptors", value: SYNC },
      { name: "Delete metadata", value: DELETE_METADATA },
      { name: "Exit", value: EXIT },
    ],
  })

  switch (choice) {
    case SELECT_DESCRIPTORS: {
      await runWithEscapeKeyHandler(async (subscriptions, subscribe) => {
        try {
          const palletPromise = select({
            message: "Select a pallet",
            choices: pallets.map((p) => ({ name: p.name, value: p })),
          })
          subscriptions.push(subscribe(() => palletPromise.cancel()))
          const pallet = await palletPromise

          const events =
            pallet.events !== undefined
              ? getLookupEntry(lookup, pallet.events)
              : []
          const errors =
            pallet.errors !== undefined
              ? getLookupEntry(lookup, pallet.errors)
              : []
          const extrinsics =
            pallet.calls !== undefined
              ? getLookupEntry(lookup, pallet.calls)
              : []

          let exitDescriptorSelection = false
          while (!exitDescriptorSelection) {
            const descriptorTypePromise = select({
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
            subscriptions.push(subscribe(() => descriptorTypePromise.cancel()))
            const descriptorType = await descriptorTypePromise
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
                    message:
                      "Continue selecting extrinsics from the same pallet?",
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
        } catch (err) {
          if (err instanceof Error && err.message === "Prompt was canceled") {
            return
          }
          throw err
        }
      })
      break
    }
    case DELETE_METADATA: {
      blowupMetadata(data.metadata)
      break
    }
    case SHOW_DESCRIPTORS: {
      console.log(
        util.inspect(data, { showHidden: false, depth: null, colors: true }),
      )
      break
    }
    case SAVE: {
      await runWithEscapeKeyHandler(async (subscriptions, subscribe) => {
        try {
          const key = await (async () => {
            if (options.key) return options.key

            const getDescriptorKeyPromise = input({
              message: "descriptor key",
              validate: (key) => !!key || "descriptor key cannot be empty",
            })
            subscriptions.push(
              subscribe(() => getDescriptorKeyPromise.cancel()),
            )

            return await getDescriptorKeyPromise
          })()

          const metadataFilePathPromise = input({
            message: "metadata file path",
            default:
              descriptorMetadata?.[key]?.metadata ?? `${key}-metadata.scale`,
            validate: (path) => !!path || "metadata filepath cannot be empty",
          })
          subscriptions.push(subscribe(() => metadataFilePathPromise.cancel()))

          const metadataFilePath = await metadataFilePathPromise

          const writeToPkgJSONPromise = confirm({
            message: "Write to package.json?",
            default: true,
          })
          subscriptions.push(subscribe(() => writeToPkgJSONPromise.cancel()))
          const writeToPkgJSON = await writeToPkgJSONPromise

          const outputFolderPromise = input({
            message: "codegen output directory",
            default: descriptorMetadata?.[key]?.outputFolder ?? process.cwd(),
            validate: (dir) => !!dir || "directory cannot be empty",
          })
          subscriptions.push(subscribe(() => outputFolderPromise.cancel()))
          const outputFolder = await outputFolderPromise

          await writeMetadataToDisk(data, metadataFilePath)

          const args = {
            data,
            key,
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
            const fileNamePromise = input({
              message: "descriptor json file name",
              validate: (value) =>
                (!!value && value !== outputFolder) ||
                "descriptor json file name cannot be equal to codegen output directory",
            })
            subscriptions.push(subscribe(() => fileNamePromise.cancel()))
            const fileName = await fileNamePromise

            await outputDescriptors({
              ...args,
              type: "file",
              fileName,
            })
          }

          await outputCodegen(
            data.descriptorData,
            data.metadata.value,
            outputFolder,
            key,
          )
        } catch (err) {
          if (err instanceof Error && err.message === "Prompt was canceled") {
            return
          }
          throw err
        }
      })

      break
    }
    case SYNC: {
      const discrepancies = checkDescriptorsForDiscrepancies(data)

      showDiscrepancies(discrepancies)

      if (discrepancies.length > 0) {
        const accept = await confirm({ message: "Accept changes" })
        if (!accept) {
          break
        }
      }

      synchronizeDescriptors(data, discrepancies)
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
