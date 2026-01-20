import fsExists from "fs.promises.exists"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { existsSync } from "node:fs"

export type EntryConfig =
  | {
      metadata: string
      genesis?: string
      codeHash?: string
    }
  | {
      chainSpec: string
      metadata?: string
      genesis?: string
      codeHash?: string
    }
  | {
      wsUrl: string
      at?: string
      metadata?: string
      genesis?: string
      codeHash?: string
    }
  | {
      chain: string
      metadata?: string
      genesis?: string
      codeHash?: string
    }
type Entries = Record<string, EntryConfig>
export interface PapiConfigOptions {
  noDescriptorsPackage?: boolean
  whitelist?: string
}
export type PapiConfig = {
  version: 0
  descriptorPath: string
  entries: Record<string, EntryConfig>
  ink?: Record<string, string>
  sol?: Record<string, string>
  options?: Partial<PapiConfigOptions>
}

export const papiFolder = ".papi"
const papiCfgDefaultFile = "polkadot-api.json"

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

  const readConfig = await (currentVersionLocationExists
    ? readFromFile(currentVersionLocation)
    : readFromFile(papiCfgDefaultFile))

  // Store into current version location if it wasn't there
  if (readConfig && !currentVersionLocationExists) {
    await writePapiConfig(undefined, readConfig)
  }
  return readConfig
}

/**
 * Writes config to configFile. If configFile is not specified, it writes to the
 * default path (.papi/polkadot-api.json).
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

  return migrate(JSON.parse(await readFile(file, "utf8")), file)
}

const MIGRATION_CHAINS: Record<string, string> = {
  ksmcc3: "kusama",
  westend2: "westend",
}
async function migrate(content: Entries | PapiConfig, file: string) {
  if (typeof content.version !== "number") {
    content = { ...defaultConfig, entries: content as Entries }
  }
  const migrationMsgs: string[] = []
  ;(content as PapiConfig).entries = Object.fromEntries(
    Object.entries((content as PapiConfig).entries).flatMap(([k, entry]) => {
      if ("chain" in entry) {
        if (entry.chain.startsWith("rococo_v2_2")) {
          migrationMsgs.push(
            `Rococo has been sunset. Removing ${entry.chain} descriptors.`,
          )
          return []
        }
        const oldKey = Object.keys(MIGRATION_CHAINS).find((k) =>
          entry.chain.startsWith(k),
        )
        if (oldKey) {
          const newChain = entry.chain.replace(oldKey, MIGRATION_CHAINS[oldKey])
          migrationMsgs.push(`Migrating ${entry.chain} to ${newChain}`)
          entry.chain = newChain
        }
      }
      return [[k, entry]]
    }),
  )
  if (migrationMsgs.length) {
    try {
      await writeToFile(file, content as PapiConfig)
      migrationMsgs.forEach((msg) => console.warn(msg))
    } catch {
      console.warn("Unable to migrate polkadot-api.json")
    }
  }
  return content as PapiConfig
}

async function writeToFile(file: string, config: PapiConfig) {
  return writeFile(file, JSON.stringify(config, null, 2) + "\n")
}
