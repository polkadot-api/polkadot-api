import { getMetadata, writeMetadataToDisk } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import ora from "ora"
import { CommonOptions } from "./commonOptions"
import { generate } from "./generate"

export async function update(
  keysInput: string | undefined,
  options: CommonOptions,
) {
  const entries = (await readPapiConfig(options.config)) ?? {}
  const keys =
    keysInput === undefined ? Object.keys(entries) : keysInput.split(",")

  const updateByKey = async (key: string) => {
    if (!(key in entries)) {
      throw new Error(`Key ${key} not set in polkadot-api config`)
    }

    // Exclude metadata file from the entry, otherwise getMetadata would load from the file
    const { metadata: filename, ...entry } = entries[key]
    if (!filename) {
      if (keysInput !== undefined) {
        console.warn(`Key ${key} doesn't have a metadata file to update`)
      }

      return
    }

    const metadata = await getMetadata(entry as EntryConfig)
    // For those without other sources than metadata file, we get a null.
    if (!metadata) {
      if (keysInput !== undefined) {
        console.warn(
          `Key ${key} doesn't have any external source to update from`,
        )
      }
      return
    }

    spinner.text = `Writing ${key} metadata`
    await writeMetadataToDisk(metadata.metadataRaw, filename)
    spinner.succeed(`${key} metadata updated`)
  }

  const spinner = ora(`Updating`).start()
  await Promise.all(keys.map(updateByKey))

  console.log(`Updating descriptors`)
  await generate({ config: options.config })

  spinner.stop()
  console.log(`Updated chain(s) "${keys.join(", ")}"`)

  if (!options.skipCodegen) {
    generate({
      config: options.config,
    })
  }
}
