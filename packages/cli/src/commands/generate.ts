import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { getDescriptors } from "@polkadot-api/codegen"
import { V15 } from "@polkadot-api/substrate-bindings"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import path from "path"
import tsc from "tsc-prog"
import { CommonOptions } from "./commonOptions"

export interface GenerateOptions extends CommonOptions {
  key?: string
}

export async function generate(opts: GenerateOptions) {
  const sources = await getSources(opts)

  if (Object.keys(sources).length == 0) {
    console.log("No chains defined in config file")
  }

  for (const [key, source] of Object.entries(sources)) {
    console.log(`Reading "${key}" metadata`)
    const metadata = await getMetadata(source)

    console.log(`Generating "${key}" code`)
    await outputCodegen(metadata!, source.outputFolder, key)
  }
}

async function getSources(
  opts: GenerateOptions,
): Promise<Record<string, EntryConfig>> {
  const config = await readPapiConfig(opts.config)
  if (!config) {
    throw new Error("Can't find the Polkadot-API configuration")
  }

  if (opts.key) {
    if (!config[opts.key]) {
      throw new Error(`Key ${opts.key} not set in polkadot-api config`)
    }
    return {
      [opts.key]: config[opts.key],
    }
  }

  return config
}

async function outputCodegen(metadata: V15, outputFolder: string, key: string) {
  const code = getDescriptors(metadata, "", "@polkadot-api/client")
  await fs.mkdir(outputFolder, { recursive: true })
  await createDtsFile(key, outputFolder, code)
}

const createDtsFile = async (key: string, dest: string, code: string) => {
  const tscFileName = path.join(dest, key)

  if (await fsExists(`${tscFileName}.ts`)) await fs.rm(`${tscFileName}.ts`)

  await fs.writeFile(`${tscFileName}.ts`, code)

  tsc.build({
    basePath: dest,
    compilerOptions: {
      skipLibCheck: true,
      emitDeclarationOnly: true,
      declaration: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
    },
  })
}
