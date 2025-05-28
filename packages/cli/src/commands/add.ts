import { getMetadata, writeMetadataToDisk } from "@/metadata"
import {
  defaultConfig,
  EntryConfig,
  papiFolder,
  readPapiConfig,
  writePapiConfig,
} from "@/papiConfig"
import { compactNumber } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"
import { getMetadataFromRuntime } from "@polkadot-api/wasm-executor"
import * as fs from "node:fs/promises"
import ora from "ora"
import { CommonOptions } from "./commonOptions"
import { generate } from "./generate"
import { join } from "node:path"
import { existsSync } from "node:fs"

export interface AddOptions extends CommonOptions {
  file?: string
  wsUrl?: string
  chainSpec?: string
  // well-known chains
  name?: string
  wasm?: string
  noPersist?: boolean
}

export async function add(key: string, options: AddOptions) {
  const config = (await readPapiConfig(options.config)) ?? defaultConfig
  const entries = config.entries

  if (key in entries) {
    console.warn(`Replacing existing ${key} config`)
  }

  if (options.file) {
    entries[key] = {
      metadata: options.file,
    }
  } else if (options.wasm) {
    const spinner = ora(`Loading metadata from runtime`).start()
    const metadataHex = (await fs.readFile(options.wasm)).toString("hex")
    const opaqueMeta = fromHex(getMetadataFromRuntime(`0x${metadataHex}`))

    // metadata comes with compact length prepended
    const metadataLen = compactNumber.dec(opaqueMeta)
    const compactLen = compactNumber.enc(metadataLen).length
    // verify we got all data
    if (opaqueMeta.length - compactLen !== metadataLen)
      throw new Error("Not able to retrieve runtime metadata")

    spinner.text = "Writing metadata"
    const metadataRaw = opaqueMeta.slice(compactLen)
    const filename = await storeMetadata(metadataRaw, key)
    spinner.succeed(`Metadata saved as ${filename}`)

    entries[key] = {
      metadata: filename,
    }
  } else {
    const entry = entryFromOptions(options)
    entries[key] = entry

    if (!options.noPersist) {
      const spinner = ora(`Loading metadata`).start()
      const { metadataRaw, genesis, codeHash } = (await getMetadata(entry))!

      spinner.text = "Writing metadata"
      const filename = await storeMetadata(metadataRaw, key)

      spinner.succeed(`Metadata saved as ${filename}`)
      entry.metadata = filename
      entry.genesis = genesis
      entry.codeHash = codeHash
    }
  }

  await writePapiConfig(options.config, config)
  console.log(`Saved new spec "${key}"`)

  if (!options.skipCodegen) {
    generate({
      config: options.config,
    })
  }
}

async function storeMetadata(metadata: Uint8Array, key: string) {
  const defaultFolder = join(papiFolder, "metadata")
  if (!existsSync(defaultFolder)) {
    await fs.mkdir(defaultFolder, { recursive: true })
  }
  const filename = join(defaultFolder, `${key}.scale`)
  await writeMetadataToDisk(metadata, filename)
  return filename
}

const entryFromOptions = (options: AddOptions): EntryConfig => {
  if (options.wsUrl) {
    return {
      wsUrl: options.wsUrl,
    }
  }
  if (options.chainSpec) {
    return {
      chainSpec: options.chainSpec,
    }
  }
  if (options.name) {
    return {
      chain: options.name,
    }
  }

  throw new Error(
    "add command needs one source, specified by options -f -w -c or -n",
  )
}
