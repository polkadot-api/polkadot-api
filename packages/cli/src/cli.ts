import { input, select, checkbox } from "@inquirer/prompts"
import * as fs from "node:fs/promises"
import { LookupEntry, getLookupFns } from "@unstoppablejs/substrate-codegen"
import { metadata as $metadata } from "@unstoppablejs/substrate-bindings"

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

class CheckboxData {
  #data

  constructor() {
    this.#data = new Set<string>()
  }

  get data(): ReadonlySet<string> {
    return this.#data
  }

  async prompt(message: string, items: string[]) {
    const selected = await checkbox({
      message,
      choices: items.map((s) => ({
        name: s,
        value: s,
        checked: this.#data.has(s),
      })),
    })

    this.#data = new Set(selected)
  }

  toJSON() {
    return Array.from(this.#data)
  }
}

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
    case EXIT:
      exit = true
      break
    default:
      break
  }
}

console.log(JSON.stringify(data))

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
