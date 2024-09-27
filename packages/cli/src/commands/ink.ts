import {
  defaultConfig,
  papiFolder,
  readPapiConfig,
  writePapiConfig,
} from "@/papiConfig"
import { existsSync } from "node:fs"
import * as fs from "node:fs/promises"
import { join } from "node:path"
import { CommonOptions } from "./commonOptions"
import { generate } from "./generate"

export interface InkAddOptions extends CommonOptions {
  key?: string
}

export const ink = {
  async add(file: string, options: InkAddOptions) {
    const metadata = JSON.parse(await fs.readFile(file, "utf-8"))
    // Remove wasm blob if it's there
    delete metadata.source

    const key = options.key || metadata.contract.name
    const config = (await readPapiConfig(options.config)) ?? defaultConfig
    const inkConfig = (config.ink ||= {})
    if (key in inkConfig) {
      console.warn(`Replacing existing ${key} config`)
    }

    const contractsFolder = join(papiFolder, "contracts")
    if (!existsSync(contractsFolder)) {
      await fs.mkdir(contractsFolder, { recursive: true })
    }
    const fileName = join(contractsFolder, key + ".json")
    await fs.writeFile(fileName, JSON.stringify(metadata, null, 2))

    inkConfig[key] = fileName
    await writePapiConfig(options.config, config)

    if (!options.skipCodegen) {
      generate({
        config: options.config,
      })
    }
  },
  async remove(key: string, options: CommonOptions) {
    const config = (await readPapiConfig(options.config)) ?? defaultConfig
    const inkConfig = (config.ink ||= {})
    if (!(key in inkConfig)) {
      console.log(`${key} contract not found in config`)
      return
    }

    const fileName = inkConfig[key]
    delete inkConfig[key]

    if (existsSync(fileName)) {
      await fs.rm(fileName)
    }

    await writePapiConfig(options.config, config)

    if (!options.skipCodegen) {
      generate({
        config: options.config,
      })
    }
  },
}
