import { WellKnownChain } from "@substrate/connect"
import fsExists from "fs.promises.exists"
import { readPackage } from "read-pkg"
import { updatePackage, writePackage } from "write-pkg"
import { readFile, writeFile } from "node:fs/promises"

export type EntryConfig = {
  outputFolder: string
  knownTypes?: string
} & (
  | {
      metadata: string
    }
  | {
      chainSpec: string
      metadata?: string
    }
  | {
      wsUrl: string
      metadata?: string
    }
  | {
      chain: WellKnownChain
      metadata?: string
    }
)
export type PapiConfig = Record<string, EntryConfig>

const papiCfgDefaultFile = "polkadot-api.json"
const packageJsonKey = "polkadot-api"

export async function readPapiConfig(
  configFile: string | undefined,
): Promise<PapiConfig | null> {
  if (configFile) return readFromFile(configFile)

  const configFromDefaultFile = await readFromFile(papiCfgDefaultFile)
  if (configFromDefaultFile) return configFromDefaultFile

  return readFromFile("package.json")
}

/**
 * Writes config to configFile.
 * If configFile is not specified, it writes to the default path, by this priority order:
 * 1. default config file (polkadot-api.json)
 * 2. package.json
 * If no pre-existing config exists, then it creates a polkadot-api.json file.
 */
export async function writePapiConfig(
  configFile: string | undefined,
  config: PapiConfig,
) {
  if (configFile) return writeToFile(configFile, config)

  const defaultCfgExists = await fsExists(papiCfgDefaultFile)
  if (defaultCfgExists) return writeToFile(papiCfgDefaultFile, config)

  const packageCfg = await readFromFile("package.json")
  if (packageCfg) {
    return writeToFile("package.json", config)
  }

  return writeToFile(papiCfgDefaultFile, config)
}

async function readFromFile(file: string) {
  const fileExists = await fsExists(file)
  if (!fileExists) return null

  if (file === "package.json") {
    const packageJson = await readPackage()
    return packageJson[packageJsonKey] ?? null
  }
  return JSON.parse(await readFile(file, "utf8"))
}

async function writeToFile(file: string, config: PapiConfig) {
  if (file === "package.json") {
    // updatePackage preserves existing values, we have to clear them to make removes work.
    await updatePackage({
      [packageJsonKey]: null,
    })
    return updatePackage({
      [packageJsonKey]: config,
    })
  }
  return writeFile(file, JSON.stringify(config, null, 2))
}
