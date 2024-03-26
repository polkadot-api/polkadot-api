import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { generateMultipleDescriptors } from "@polkadot-api/codegen"
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

  console.log(`Reading metadata`)
  const chains = await Promise.all(
    Object.entries(sources).map(async ([key, source]) => ({
      key,
      metadata: (await getMetadata(source))!,
      knownDeclarations: "",
    })),
  )

  const outputFolder = Object.values(sources)[0]?.outputFolder
  if (outputFolder) {
    await outputCodegen(chains, outputFolder)
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

async function outputCodegen(
  chains: Array<{
    key: string
    metadata: V15
    knownDeclarations: string
  }>,
  outputFolder: string,
) {
  console.log(`Generating code`)

  const { descriptorsFileContent, checksums, typesFileContent, publicTypes } =
    generateMultipleDescriptors(chains, {
      client: "@polkadot-api/client",
      checksums: "./checksums.json",
      types: "./common-types",
    })

  console.log("Writing code")
  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(
    path.join(outputFolder, "checksums.json"),
    JSON.stringify(checksums),
  )
  await fs.writeFile(
    path.join(outputFolder, "common-types.ts"),
    typesFileContent,
  )
  await fs.writeFile(
    path.join(outputFolder, "public-types.ts"),
    `export { ${publicTypes.join(",\n")} } from './common-types';`,
  )
  await Promise.all(
    chains.map((chain, i) =>
      createDtsFile(chain.key, outputFolder, descriptorsFileContent[i]),
    ),
  )

  tsc.build({
    basePath: outputFolder,
    compilerOptions: {
      skipLibCheck: true,
      emitDeclarationOnly: true,
      declaration: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    },
  })
}

const createDtsFile = async (key: string, dest: string, code: string) => {
  const tscFileName = path.join(dest, key)

  if (await fsExists(`${tscFileName}.ts`)) await fs.rm(`${tscFileName}.ts`)

  await fs.writeFile(
    `${tscFileName}.ts`,
    code + "\nexport * from './public-types'",
  )
}
