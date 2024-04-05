import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { generateMultipleDescriptors } from "@polkadot-api/codegen"
import { V15 } from "@polkadot-api/substrate-bindings"
import fs from "fs/promises"
import path, { join } from "path"
import process from "process"
import tsc from "tsc-prog"
import tsup from "tsup"
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
      knownTypes: {},
    })),
  )

  const descriptorsDir = join(
    process.cwd(),
    "node_modules",
    "@polkadot-api",
    "descriptors",
  )

  await fs.mkdir(descriptorsDir, { recursive: true })
  await generatePackageJson(join(descriptorsDir, "package.json"))
  await outputCodegen(chains, join(descriptorsDir, "src"))
  await compileCodegen(descriptorsDir)
  await fs.rm(join(descriptorsDir, "src"), { recursive: true })
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
    knownTypes: Record<string, string>
  }>,
  outputFolder: string,
) {
  const clientPath = (globalThis as any).PAPI_CODEGEN_TOP_LEVEL
    ? "polkadot-connect"
    : "@polkadot-api/client"

  const { descriptorsFileContent, checksums, typesFileContent, publicTypes } =
    generateMultipleDescriptors(chains, {
      client: clientPath,
      checksums: "./checksums.json",
      types: "./common-types",
    })

  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(
    path.join(outputFolder, "checksums.json"),
    JSON.stringify(checksums),
  )
  await fs.writeFile(
    path.join(outputFolder, "common-types.ts"),
    typesFileContent,
  )
  await Promise.all(
    chains.map((chain, i) =>
      fs.writeFile(
        join(outputFolder, `${chain.key}.ts`),
        descriptorsFileContent[i],
      ),
    ),
  )
  await generateIndex(
    outputFolder,
    chains.map((chain) => chain.key),
    publicTypes,
  )
}

async function compileCodegen(packageDir: string) {
  const srcDir = join(packageDir, "src")
  const outDir = join(packageDir, "dist")

  await tsup.build({
    format: ["cjs", "esm"],
    entry: [path.join(srcDir, "index.ts")],
    outDir,
    outExtension: (ctx) => ({
      js: ctx.format === "esm" ? ".mjs" : ".js",
    }),
  })

  tsc.build({
    basePath: srcDir,
    compilerOptions: {
      skipLibCheck: true,
      declaration: true,
      emitDeclarationOnly: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      outDir,
    },
  })
}

const generateIndex = async (
  path: string,
  keys: string[],
  publicTypes: string[],
) => {
  const indexTs = [
    ...keys.flatMap((key) => [
      `export { default as ${key} } from "./${key}";`,
      `export type * from "./${key}";`,
    ]),
    `export {`,
    publicTypes.join(", "),
    `} from './common-types';`,
  ].join("\n")
  await fs.writeFile(join(path, "index.ts"), indexTs)
}

const generatePackageJson = async (path: string) => {
  await fs.writeFile(
    path,
    `{
      "name": "@polkadot-api/descriptors",
      "exports": {
        ".": {
          "module": "./dist/index.mjs",
          "import": "./dist/index.mjs",
          "require": "./dist/index.js",
          "default": "./dist/index.js"
        },
        "./package.json": "./package.json"
      },
      "main": "./dist/index.js",
      "module": "./dist/index.mjs",
      "browser": "./dist/index.mjs",
      "types": "./dist/index.d.ts",
      "sideEffects": false,
      "peerDependencies": {
        "@polkadot-api/client": "*"
      }
    }`,
  )
}
