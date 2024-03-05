import { getMetadata, writeMetadataToDisk } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import ora from "ora"

export async function update(keysInput: string | undefined) {
  const entries = (await readPapiConfig()) ?? {}
  const keys =
    keysInput === undefined ? Object.keys(entries) : keysInput.split(",")

  for (let key of keys) {
    if (!(key in entries)) {
      throw new Error(`Key ${key} not configured in package.json`)
    }

    const spinner = ora(`Updating ${key}`).start()

    // Exclude metadata file from the entry, otherwise getMetadata would load from the file
    const { metadata: filename, ...entry } = entries[key]
    if (!filename) {
      if (keysInput !== undefined) {
        console.warn(`Key ${key} doesn't have a metadata file to update`)
      }

      spinner.stop()
      continue
    }

    const metadata = await getMetadata(entry as EntryConfig)
    // For those without other sources than metadata file, we get a null.
    if (!metadata) {
      if (keysInput !== undefined) {
        console.warn(
          `Key ${key} doesn't have any external source to update from`,
        )
      }
      spinner.stop()
      continue
    }

    spinner.text = `Writing ${key} metadata`
    await writeMetadataToDisk(metadata, filename)

    spinner.succeed(`${key} metadata updated`)
  }
}
