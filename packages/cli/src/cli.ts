import { input, select, checkbox } from "@inquirer/prompts"
import * as fs from "node:fs/promises"
import { metadata as $metadata } from "@unstoppablejs/substrate-codecs"
import { LookupEntry, getLookupFns } from "@unstoppablejs/substrate-codegen"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

const metadataPath = await input({
  message: "Enter path to metadata file",
  default: "metadata.scale",
})
const rawMetadata = await fs.readFile(metadataPath)
const { metadata } = $metadata.dec(rawMetadata)

assertIsv14(metadata)

const pallets = metadata.value.pallets

const SELECT_DESCRIPTORS = "SELECT_DESCRIPTORS"
const EXIT = "EXIT"
const CONSTANTS = "CONSTANTS"
const STORAGE = "STORAGE"
const EVENTS = "EVENTS"
const ERRORS = "ERRORS"
const EXTRINSICS = "EXTRINSICS"

const data: Record<
  string,
  {
    constants: Set<string>
    storage: Set<string>
    events: Set<string>
    errors: Set<string>
    extrinsics: Set<string>
  }
> = {}

let exit = false
while (!exit) {
  const choice = await select({
    message: "What do you want to do?",
    choices: [
      { name: "Select descriptors", value: SELECT_DESCRIPTORS },
      { name: "Exit", value: EXIT },
    ],
  })

  switch (choice) {
    case SELECT_DESCRIPTORS:
      const pallet = await select({
        message: "Select a pallet",
        choices: pallets.map((p) => ({ name: p.name, value: p })),
      })

      const eventLookupFns = getLookupFns(metadata.value.lookup).getLookupEntry(
        Number(pallet.events),
      )
      assertIsEnum(eventLookupFns)
      const events = Object.keys(eventLookupFns.value)

      const errorLookupFns = getLookupFns(metadata.value.lookup).getLookupEntry(
        Number(pallet.errors),
      )
      assertIsEnum(errorLookupFns)
      const errors = Object.keys(errorLookupFns.value)

      const extrinsicLookupFns = getLookupFns(
        metadata.value.lookup,
      ).getLookupEntry(Number(pallet.calls))
      assertIsEnum(extrinsicLookupFns)
      const extrinsics = Object.keys(extrinsicLookupFns.value)

      if (!data[pallet.name]) {
        data[pallet.name] = {
          constants: new Set(),
          storage: new Set<string>(),
          events: new Set<string>(),
          errors: new Set<string>(),
          extrinsics: new Set<string>(),
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
            const selectedConstants = await checkbox({
              message: "Select constants",
              choices: pallet.constants.map((c) => ({
                name: c.name,
                value: c,
                checked: data[pallet.name]?.constants.has(c.name),
              })),
            })
            data[pallet.name].constants = new Set(
              selectedConstants.map((c) => c.name),
            )
            break
          }
          case STORAGE: {
            const selectedStorage = await checkbox({
              message: "Select Storage",
              choices:
                pallet.storage?.items.map((c) => ({
                  name: c.name,
                  value: c,
                  checked: data[pallet.name]?.storage.has(c.name),
                })) ?? [],
            })
            data[pallet.name].storage = new Set(
              selectedStorage.map((c) => c.name),
            )
            break
          }
          case EVENTS: {
            const selectedEvents = await checkbox({
              message: "Select Events",
              choices:
                events?.map((e) => ({
                  name: e,
                  value: e,
                  checked: data[pallet.name]?.events.has(e),
                })) ?? [],
            })
            data[pallet.name].events = new Set(selectedEvents)
            break
          }
          case ERRORS: {
            const selectedErrors = await checkbox({
              message: "Select Errors",
              choices:
                errors?.map((e) => ({
                  name: e,
                  value: e,
                  checked: data[pallet.name]?.errors.has(e),
                })) ?? [],
            })
            data[pallet.name].errors = new Set(selectedErrors)
            break
          }
          case EXTRINSICS: {
            const selectedExtrinsics = await checkbox({
              message: "Select Extrinsics",
              choices:
                extrinsics?.map((e) => ({
                  name: e,
                  value: e,
                  checked: data[pallet.name]?.extrinsics.has(e),
                })) ?? [],
            })
            data[pallet.name].extrinsics = new Set(selectedExtrinsics)
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
    case EXIT:
      exit = true
      break
    default:
      break
  }
}

const serializableData = Object.entries(data).map(([k, v]) => [
  k,
  {
    constants: Array.from(v.constants),
    storage: Array.from(v.storage),
    events: Array.from(v.events),
    errors: Array.from(v.errors),
    extrinsics: Array.from(v.extrinsics),
  },
])

console.log(JSON.stringify(serializableData))

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
    throw new Error("unreachable")
  }
}
