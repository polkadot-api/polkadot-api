import { defaultConfig, readPapiConfig, writePapiConfig } from "@/papiConfig"
import { CommonOptions } from "./commonOptions"
import { generate } from "./generate"

export async function remove(key: string, options: CommonOptions) {
  const config = (await readPapiConfig(options.config)) ?? defaultConfig
  const entries = config.entries

  if (!(key in entries)) {
    throw new Error(`Key ${key} not set in polkadot-api config`)
  }

  delete entries[key]

  await writePapiConfig(options.config, config)
  console.log(`Removed chain "${key}" from config`)

  if (!options.skipCodegen) {
    generate({
      config: options.config,
      descriptorsPackage: options.descriptorsPackage,
    })
  }
}
