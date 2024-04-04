import { getMetadata, writeMetadataToDisk } from "@/metadata"
import { EntryConfig, readPapiConfig, writePapiConfig } from "@/papiConfig"
import { WellKnownChain } from "@substrate/connect"
import ora from "ora"
import { CommonOptions } from "./commonOptions"

export interface AddOptions extends CommonOptions {
  file?: string
  wsUrl?: string
  chainSpec?: string
  name?: WellKnownChain
  noPersist?: boolean
}

export async function add(key: string, options: AddOptions) {
  const entries = (await readPapiConfig(options.config)) ?? {}
  if (key in entries) {
    console.warn(`Replacing existing ${key} config`)
  }

  if (options.file) {
    entries[key] = {
      metadata: options.file,
    }
  } else {
    const entry = entryFromOptions(options)
    entries[key] = entry

    if (!options.noPersist) {
      const spinner = ora(`Loading metadata`).start()
      const metadata = await getMetadata(entry)

      spinner.text = "Writing metadata"
      const filename = `${key}.scale`
      await writeMetadataToDisk(metadata!, filename)

      spinner.succeed(`Metadata saved as ${filename}`)
      entry.metadata = filename
    }
  }

  await writePapiConfig(options.config, entries)
  return console.log(`Saved new spec "${key}"`)
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
      chain: options.name as WellKnownChain,
    }
  }

  throw new Error(
    "add command needs one source, specified by options -f -w -c or -n",
  )
}
