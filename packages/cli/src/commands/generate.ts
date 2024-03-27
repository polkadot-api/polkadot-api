import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { generateMultipleDescriptors } from "@polkadot-api/codegen"
import { V15 } from "@polkadot-api/substrate-bindings"
import fsExists from "fs.promises.exists"
import fs from "fs/promises"
import path, { join } from "path"
import process from "process"
import tsc from "tsc-prog"
import { CommonOptions } from "./commonOptions"
import { createRequire } from "module"
import { existsSync } from "fs"

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

  const clientDir = join(getClientDir(), "descriptors/generated")
  await outputCodegen(chains, clientDir)

  await generateIndexes(clientDir, Object.keys(sources))
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
      client: "../../dist",
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

  console.log("Generating ESM")
  tsc.build({
    basePath: outputFolder,
    compilerOptions: {
      skipLibCheck: true,
      declaration: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    },
  })
  const generatedFiles = [
    "public-types",
    "common-types",
    ...chains.map((chain) => chain.key),
  ]
  await Promise.all(
    generatedFiles.map((file) =>
      fs.rename(
        path.join(outputFolder, file + ".js"),
        path.join(outputFolder, file + ".mjs"),
      ),
    ),
  )

  console.log("Generating CJS")
  tsc.build({
    basePath: outputFolder,
    compilerOptions: {
      skipLibCheck: true,
      declaration: true,
      target: "esnext",
      module: "commonjs",
      moduleResolution: "node",
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    },
  })

  // await Promise.all(
  //   generatedFiles.map((file) =>
  //     fs.unlink(path.join(outputFolder, file + ".ts")),
  //   ),
  // )
}

const createDtsFile = async (key: string, dest: string, code: string) => {
  const tscFileName = path.join(dest, key)

  if (await fsExists(`${tscFileName}.ts`)) await fs.rm(`${tscFileName}.ts`)

  await fs.writeFile(`${tscFileName}.ts`, code)
}

const getClientDir = () => {
  const require = createRequire(process.cwd() + "/")
  const candidates = require.resolve.paths("@polkadot-api/client")
  const result = candidates
    ?.map((path) => join(path, "@polkadot-api/client"))
    .find(existsSync)
  if (!result) {
    throw new Error("@polkadot-api/client can't be found")
  }
  return result
}

const generateIndexes = async (path: string, keys: string[]) => {
  const indexCjs = [
    "module.exports = {",
    ...keys.map((key) => `${key}: require("./${key}.js").default,`),
    '...require("./public-types.js")',
    "};",
  ].join("\n")
  await fs.writeFile(join(path, "index.js"), indexCjs)

  const indexEsm = [
    ...keys.map((key) => `export { default as ${key} } from "./${key}.mjs";`),
    `export * from "./public-types.mjs";`,
  ].join("\n")
  await fs.writeFile(join(path, "index.mjs"), indexEsm)

  const indexDts = [
    ...keys.flatMap((key) => [
      `export { default as ${key} } from "./${key}";`,
      `export type * from "./${key}";`,
    ]),
    `export * from "./public-types";`,
  ].join("\n")
  await fs.writeFile(join(path, "index.d.ts"), indexDts)
}
