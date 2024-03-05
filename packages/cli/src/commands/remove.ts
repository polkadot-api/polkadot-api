import { readPapiConfig, writePapiConfig } from "@/papiConfig"

export async function remove(key: string) {
  const entries = (await readPapiConfig()) ?? {}

  if (!(key in entries)) {
    throw new Error(`Key ${key} not configured in package.json`)
  }

  const entry = entries[key]
  delete entries[key]

  await writePapiConfig(entries)
}
