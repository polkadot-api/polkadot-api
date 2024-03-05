import { readPapiConfig, writePapiConfig } from "@/papiConfig"
import { CommonOptions } from "./commonOptions"

export async function remove(key: string, options: CommonOptions) {
  const entries = (await readPapiConfig(options.config)) ?? {}

  if (!(key in entries)) {
    throw new Error(`Key ${key} not set in polkadot-api config`)
  }

  const entry = entries[key]
  delete entries[key]

  await writePapiConfig(options.config, entries)
  console.log(`Removed chain "${key}" from config`)
}
