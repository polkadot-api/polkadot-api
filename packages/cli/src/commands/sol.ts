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

export const sol = {
  async add(file: string, key: string, options: CommonOptions) {
    const abi = JSON.parse(await fs.readFile(file, "utf-8"))

    const config = (await readPapiConfig(options.config)) ?? defaultConfig
    const solConfig = (config.sol ||= {})
    if (key in solConfig) {
      console.warn(`Replacing existing ${key} config`)
    }

    const contractsFolder = join(papiFolder, "contracts")
    if (!existsSync(contractsFolder)) {
      await fs.mkdir(contractsFolder, { recursive: true })
    }
    const fileName = join(contractsFolder, key + ".json")
    await fs.writeFile(fileName, JSON.stringify(abi, null, 2))

    solConfig[key] = fileName
    await writePapiConfig(options.config, config)

    if (!options.skipCodegen) {
      generate({
        config: options.config,
      })
    }
  },
  async remove(key: string, options: CommonOptions) {
    const config = (await readPapiConfig(options.config)) ?? defaultConfig
    const solConfig = (config.sol ||= {})
    if (!(key in solConfig)) {
      console.log(`${key} contract not found in config`)
      return
    }

    const fileName = solConfig[key]
    delete solConfig[key]

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
