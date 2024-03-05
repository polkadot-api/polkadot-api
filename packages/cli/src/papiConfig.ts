import { WellKnownChain } from "@substrate/connect"
import { readPackage } from "read-pkg"
import { updatePackage } from "write-pkg"

export type EntryConfig = {
  outputFolder: string
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

const packageJsonKey = "polkadot-api"

export async function readPapiConfig(): Promise<PapiConfig | null> {
  const packageJson = await readPackage()
  return packageJson[packageJsonKey] ?? null
}

export async function writePapiConfig(config: PapiConfig) {
  return updatePackage({
    [packageJsonKey]: config,
  })
}
