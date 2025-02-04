import fsExists from "fs.promises.exists"
import { readPackage } from "read-pkg"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { existsSync } from "node:fs"

export type EntryConfig =
  | {
      metadata: string
      genesis?: string
    }
  | {
      chainSpec: string
      metadata?: string
      genesis?: string
    }
  | {
      wsUrl: string
      metadata?: string
      genesis?: string
    }
  | {
      chain: string
      metadata?: string
      genesis?: string
    }
type Entries = Record<string, EntryConfig>
export interface PapiConfigOptions {
  noDescriptorsPackage?: boolean
}
export type PapiConfig = {
  version: 0
  descriptorPath: string
  entries: Record<string, EntryConfig>
  ink?: Record<string, string>
  options?: Partial<PapiConfigOptions>
}

export const papiFolder = ".papi"
const papiCfgDefaultFile = "polkadot-api.json"
const packageJsonKey = "polkadot-api"

export const defaultConfig: PapiConfig = {
  version: 0,
  descriptorPath: join(papiFolder, "descriptors"),
  entries: {},
}

export async function readPapiConfig(
  configFile: string | undefined,
): Promise<PapiConfig | null> {
  if (configFile) return readFromFile(configFile)

  const currentVersionLocation = join(papiFolder, papiCfgDefaultFile)
  const currentVersionLocationExists = await fsExists(currentVersionLocation)

  const readConfig =
    (await (currentVersionLocationExists
      ? readFromFile(currentVersionLocation)
      : readFromFile(papiCfgDefaultFile))) ?? (await readFromPackageJson())

  // Store into current version location if it wasn't there
  if (readConfig && !currentVersionLocationExists) {
    await writePapiConfig(undefined, readConfig)
  }
  return readConfig
}

/**
 * Writes config to configFile. If configFile is not specified, it writes to the
 * default path, by this priority order:
 *
 * 1. Default config file (polkadot-api.json)
 * 2. Package.json If no pre-existing config exists, then it creates a
 * polkadot-api.json file.
 */
export async function writePapiConfig(
  configFile: string | undefined,
  config: PapiConfig,
) {
  if (configFile) return writeToFile(configFile, config)

  if (!existsSync(papiFolder)) {
    await mkdir(papiFolder)
  }
  return writeToFile(join(papiFolder, papiCfgDefaultFile), config)
}

async function readFromFile(file: string) {
  const fileExists = await fsExists(file)
  if (!fileExists) return null

  return migrate(JSON.parse(await readFile(file, "utf8")))
}
async function readFromPackageJson() {
  const packageJson = await readPackage()
  if (!(packageJsonKey in packageJson)) return null
  console.warn("Papi config in package.json is deprecated")
  return migrate(packageJson[packageJsonKey])
}

function migrate(content: Entries | PapiConfig): PapiConfig {
  if (typeof content.version === "number") {
    return content as any
  }
  return {
    ...defaultConfig,
    entries: content as Entries,
  }
}

async function writeToFile(file: string, config: PapiConfig) {
  if (file === "package.json") {
    throw new Error("Papi config in package.json is deprecated")
  }
  return writeFile(file, JSON.stringify(config, null, 2))
}
