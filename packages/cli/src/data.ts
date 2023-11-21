import { getMetadata } from "./metadata"
import { metadata } from "@polkadot-api/substrate-bindings"
import type { CodecType } from "scale-ts"
import { z } from "zod"
import descriptorSchema from "./descriptor-schema"
import { checkbox } from "@inquirer/prompts"
import { runWithEscapeKeyHandler } from "./keyboard"

type Metadata = CodecType<typeof metadata>["metadata"]
type V14Metadata = Metadata & { tag: "v14" }

type DescriptorData = Record<
  string,
  {
    constants: Record<string, string>
    storage: Record<string, string>
    events: Record<string, string>
    errors: Record<string, string>
    extrinsics: Record<string, string>
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
    type: "constants" | "storage" | "events" | "errors" | "extrinsics",
    pallet: string,
    message: string,
    items: [string, string][],
  ) {
    this.descriptorData[pallet] = this.descriptorData[pallet]
      ? this.descriptorData[pallet]
      : defaultDescriptorDataRecord
    const data = this.descriptorData[pallet][type]

    await runWithEscapeKeyHandler(async (subscriptions, subscribe) => {
      try {
        const selectedPromise = checkbox({
          message,
          choices: items.map(([s, checksum]) => ({
            name: s,
            value: [s, checksum] as const,
            checked: s in data,
          })),
        })
        subscriptions.push(subscribe(() => selectedPromise.cancel()))
        const selected = await selectedPromise

        for (const [s, checksum] of selected) {
          data[s] = checksum
        }
      } catch (err) {
        if (err instanceof Error && err.message === "Prompt was canceled") {
          return
        }
        throw err
      }
    })
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
