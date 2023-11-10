import { getMetadata } from "./metadata"
import { metadata } from "@polkadot-api/substrate-bindings"
import type { CodecType } from "scale-ts"
import { z } from "zod"
import descriptorSchema from "./descriptor-schema"
import { checkbox, select, confirm } from "@inquirer/prompts"
import chalk from "chalk"

type Metadata = CodecType<typeof metadata>["metadata"]
type V14Metadata = Metadata & { tag: "v14" }

type DescriptorData = Record<
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

const defaultDescriptorDataRecord: DescriptorData[string] = {
  constants: {},
  storage: {},
  events: {},
  errors: {},
  extrinsics: {},
}

export class Data {
  #metadata!: V14Metadata
  #magicNumber!: number
  #isInitialized = false

  outputFolder?: string

  descriptorData: DescriptorData

  constructor() {
    this.descriptorData = {}
  }

  async promptCheckboxData(
    type: "constants" | "storage" | "events" | "errors",
    pallet: string,
    message: string,
    items: [string, bigint][],
  ) {
    this.descriptorData[pallet] = this.descriptorData[pallet] ?? {
      constants: {},
      storage: {},
      events: {},
      errors: {},
      extrinsics: {},
    }
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
    this.descriptorData[pallet] = this.descriptorData[pallet]
      ? this.descriptorData[pallet]
      : defaultDescriptorDataRecord
    const data = this.descriptorData[pallet].extrinsics

    const [ext, checksum] = await select({
      message: "Select an extrinsic",
      choices: extrinsics.map(([s, checksum]) => ({
        name: s in data ? chalk.green(s) : s,
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

    const newSelectedPalletEvents = newSelectedEvents.reduce(
      (cur, [pallet, event]) => ({
        ...cur,
        [pallet]: [...(cur[pallet] ?? []), event],
      }),
      {} as Record<string, string[]>,
    )
    for (const [pallet, events] of Object.entries(newSelectedPalletEvents)) {
      data[ext].events[pallet] = new Set(events)
    }

    const newSelectedPalletErrors = newSelectedErrors.reduce(
      (cur, [pallet, error]) => ({
        ...cur,
        [pallet]: [...(cur[pallet] ?? []), error],
      }),
      {} as Record<string, string[]>,
    )
    for (const [pallet, errors] of Object.entries(newSelectedPalletErrors)) {
      data[ext].errors[pallet] = new Set(errors)
    }
  }

  static async fromSavedDescriptors(
    descriptorMetadata: z.TypeOf<typeof descriptorSchema>[string],
  ) {
    const data = new Data()

    const { magicNumber, metadata } = await getMetadata({
      source: "file",
      file: descriptorMetadata.metadata,
    })

    data.outputFolder = descriptorMetadata.outputFolder
    data.setMetadata(magicNumber, metadata)

    data.descriptorData = descriptorMetadata.descriptors

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
}
