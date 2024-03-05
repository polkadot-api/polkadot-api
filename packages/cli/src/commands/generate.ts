import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { getDescriptors } from "@polkadot-api/codegen"
import { V15 } from "@polkadot-api/metadata-builders"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import ora from "ora"
import path from "path"
import tsc from "tsc-prog"

export interface GenerateOptions {
  key?: string
}

export async function generate(opts: GenerateOptions) {
  const sources = await getSources(opts)

  for (const [key, source] of Object.entries(sources)) {
    const spinner = ora(`Reading ${key} metadata`).start()
    const metadata = await getMetadata(source)

    spinner.text = `Generating ${key}`
    await outputCodegen(metadata!, source.outputFolder, key)

    spinner.succeed(`Generated ${key}`)
  }
}

async function getSources(
  opts: GenerateOptions,
): Promise<Record<string, EntryConfig>> {
  const config = await readPapiConfig()
  if (!config) {
    throw new Error("Polkadot-API not configured in package.json")
  }

  if (opts.key) {
    if (!config[opts.key]) {
      throw new Error(`Key ${opts.key} not found in package.json config`)
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
