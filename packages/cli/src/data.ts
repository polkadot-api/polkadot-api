import { getMetadata } from "./metadata"
import { metadata } from "@polkadot-api/substrate-bindings"
import type { CodecType } from "scale-ts"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import { z } from "zod"
import descriptorSchema from "./descriptor-schema"
import { checkbox, select, confirm } from "@inquirer/prompts"
import util from "util"

type Metadata = CodecType<typeof metadata>["metadata"]
type V14Metadata = Metadata & { tag: "v14" }

type FromSavedDescriptorsArgs = {
  key: string
  pkgJSONKey: string
  fileName?: string
}

export class Data {
  #metadata!: V14Metadata
  #magicNumber!: number
  #isInitialized = false

  outputFolder?: string

  descriptorData: Record<
    string,
    {
      constants: Record<string, bigint>
      storage: Record<string, bigint>
      events: Record<string, bigint>
      errors: Record<string, bigint>
      extrinsics: Record<
        string,
        {
          checksum: bigint
          events: Record<string, Set<string>>
          errors: Record<string, Set<string>>
        }
      >
    }
  >

  constructor() {
    this.descriptorData = {}
  }

  async promptCheckboxData(
    type: "constants" | "storage" | "events" | "errors",
    pallet: string,
    message: string,
    items: [string, bigint][],
  ) {
    this.descriptorData[pallet] = this.descriptorData[pallet] ?? {}
    this.descriptorData[pallet][type] = this.descriptorData[pallet][type] ?? {}
    const data = this.descriptorData[pallet][type]

    const selected = await checkbox({
      message,
      choices: items.map(([s, checksum]) => ({
        name: s,
        value: [s, checksum] as const,
        checked: s in data,
      })),
    })

    for (const [s, checksum] of selected) {
      data[s] = checksum
    }
  }

  async promptExtrinsicData(
    pallet: string,
    extrinsics: [name: string, checksum: bigint][],
    events: ReadonlyArray<readonly [pallet: string, event: string]>,
    errors: ReadonlyArray<readonly [pallet: string, event: string]>,
  ) {
    this.descriptorData[pallet] = this.descriptorData[pallet] ?? {}
    this.descriptorData[pallet].extrinsics =
      this.descriptorData[pallet].extrinsics ?? {}
    const data = this.descriptorData[pallet].extrinsics

    const [ext, checksum] = await select({
      message: "Select an extrinsic",
      choices: extrinsics.map(([s, checksum]) => ({
        name: s,
        value: [s, checksum],
      })),
    })

    if (ext in data) {
      const deleteExt = await confirm({ message: "Delete extrinsic?" })
      if (deleteExt) {
        delete data[ext]
        return
      }
    }

    if (!data[ext]) {
      data[ext] = { events: {}, errors: {}, checksum }
    }
    for (const [pallet, _] of events) {
      if (!data[ext].events[pallet]) {
        data[ext].events[pallet] = new Set()
      }
    }
    for (const [pallet, _] of errors) {
      if (!data[ext].errors[pallet]) {
        data[ext].errors[pallet] = new Set()
      }
    }
    const selectedEvents = data[ext].events
    const selectedErrors = data[ext].errors

    const newSelectedEvents = await checkbox({
      message: "Select Events for this extrinsic",
      choices: events.map(([pallet, event]) => ({
        name: `${pallet} - ${event}`,
        value: [pallet, event] as [pallet: string, event: string],
        checked: selectedEvents[pallet].has(event),
      })),
    })
    const newSelectedErrors = await checkbox({
      message: "Select Errors for this extrinsic",
      choices: errors.map(([pallet, error]) => ({
        name: `${pallet} - ${error}`,
        value: [pallet, error] as [pallet: string, event: string],
        checked: selectedErrors[pallet].has(error),
      })),
    })

    for (const [pallet, _] of newSelectedEvents) {
      data[ext].events[pallet].clear()
    }
    for (const [pallet, _] of newSelectedErrors) {
      data[ext].errors[pallet].clear()
    }
    for (const [pallet, event] of newSelectedEvents) {
      data[ext].events[pallet].add(event)
    }
    for (const [pallet, error] of newSelectedErrors) {
      data[ext].errors[pallet].add(error)
    }
  }

  static async fromSavedDescriptors(args: FromSavedDescriptorsArgs) {
    const data = new Data()

    const descriptorMetadata = await (async () => {
      if (await fsExists("package.json")) {
        const pkgJSON = JSON.parse(
          await fs.readFile("package.json", { encoding: "utf-8" }),
        )
        const schema = z.object({ [args.pkgJSONKey]: descriptorSchema })

        const result = await schema.safeParseAsync(pkgJSON)
        if (result.success) {
          return result.data[args.pkgJSONKey][args.key]
        }
      } else if (args.fileName) {
        const file = JSON.parse(
          await fs.readFile(args.fileName, { encoding: "utf-8" }),
        )
        const result = await descriptorSchema.parseAsync(file)

        return result[args.key]
      }

      return
    })()

    if (descriptorMetadata) {
      const { magicNumber, metadata } = await getMetadata({
        source: "file",
        file: descriptorMetadata?.metadata,
      })

      data.outputFolder = descriptorMetadata.outputFolder
      data.setMetadata(magicNumber, metadata)

      const { descriptors } = descriptorMetadata
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
    }

    return data
  }

  setMetadata(magicNumber: number, metadata: V14Metadata) {
    this.#metadata = metadata
    this.#magicNumber = magicNumber
    this.#isInitialized = true
  }

  get isInitialized(): boolean {
    return this.#isInitialized
  }

  get magicNumber(): number {
    this.#guardUninitialized()

    return this.#magicNumber
  }

  get metadata(): V14Metadata {
    this.#guardUninitialized()

    return this.#metadata
  }

  #guardUninitialized() {
    if (!this.#isInitialized) {
      throw new Error("uninitialized")
    }
  }

  [util.inspect.custom]() {
    return this.toJSON()
  }

  toJSON() {
    return this.descriptorData
  }
}
