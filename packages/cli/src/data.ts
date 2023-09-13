import { getMetadata, encodeMetadata } from "./metadata"
import { CodecType, metadata } from "@unstoppablejs/substrate-bindings"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import { z } from "zod"
import { newDescriptorSchema } from "./descriptor-schema"

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

  static async fromSavedDescriptors(args: FromSavedDescriptorsArgs) {
    const data = new Data()

    const descriptorMetadata = await (async () => {
      if (await fsExists("package.json")) {
        const pkgJSON = JSON.parse(
          await fs.readFile("package.json", { encoding: "utf-8" }),
        )
        const schema = z.object({ [args.pkgJSONKey]: newDescriptorSchema })

        const result = await schema.parseAsync(pkgJSON)

        return result[args.pkgJSONKey][args.key]
      } else if (args.fileName) {
        const file = JSON.parse(
          await fs.readFile(args.fileName, { encoding: "utf-8" }),
        )
        const result = await newDescriptorSchema.parseAsync(file)

        return result[args.key]
      }

      return
    })()

    if (descriptorMetadata) {
      const { magicNumber, metadata } = await getMetadata({
        source: "file",
        file: descriptorMetadata?.metadata,
      })

      data.setMetadata(magicNumber, metadata)
    }

    return data
  }

  setMetadata(magicNumber: number, metadata: V14Metadata) {
    this.#metadata = metadata
    this.#magicNumber = magicNumber
    this.#isInitialized = true
  }

  async writeMetadataToDisk(outFile: string) {
    this.#guardUninitialized()
    const encoded = encodeMetadata({
      magicNumber: this.#magicNumber,
      metadata: this.metadata,
    })
    await fs.writeFile(outFile, encoded)
  }

  get isInitialized(): boolean {
    return this.#isInitialized
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
