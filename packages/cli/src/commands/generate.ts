import { getMetadata } from "@/metadata"
import { EntryConfig, readPapiConfig } from "@/papiConfig"
import { generateMultipleDescriptors } from "@polkadot-api/codegen"
import { Tuple, V14, V15, Vector } from "@polkadot-api/substrate-bindings"
import fs, { mkdtemp, rm } from "fs/promises"
import path, { join } from "path"
import process from "process"
import tsc from "tsc-prog"
import tsup, { build } from "tsup"
import { CommonOptions } from "./commonOptions"
import fsExists from "fs.promises.exists"
import { existsSync } from "fs"
import { tmpdir } from "os"
import { EntryPointCodec } from "@polkadot-api/metadata-compatibility"
import { TypedefCodec } from "@polkadot-api/metadata-compatibility"

export interface GenerateOptions extends CommonOptions {
  key?: string
  clientLibrary?: string
  whitelist?: string
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
      metadata: (await getMetadata(source))!.metadata,
      knownTypes: {},
    })),
  )

  const descriptorsDir = join(
    process.cwd(),
    "node_modules",
    "@polkadot-api",
    "descriptors",
  )

  const clientPath = opts.clientLibrary ?? "polkadot-api"

  if (existsSync(descriptorsDir))
    await fs.rm(descriptorsDir, { recursive: true })

  await fs.mkdir(descriptorsDir, { recursive: true })
  await generatePackageJson(join(descriptorsDir, "package.json"))

  const whitelist = opts.whitelist ? await readWhitelist(opts.whitelist) : null
  await outputCodegen(
    chains,
    join(descriptorsDir, "src"),
    clientPath,
    whitelist,
  )
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
    metadata: V14 | V15
    knownTypes: Record<string, string>
  }>,
  outputFolder: string,
  clientPath: string,
  whitelist: string[] | null,
) {
  const {
    descriptorsFileContent,
    descriptorTypesFileContent,
    metadataTypes,
    typesFileContent,
    publicTypes,
  } = generateMultipleDescriptors(
    chains,
    {
      client: clientPath,
      metadataTypes: "./metadataTypes.scale",
      types: "./common-types",
      descriptorValues: "./descriptors",
    },
    {
      whitelist: whitelist ?? undefined,
    },
  )
  const EntryPointsCodec = Vector(EntryPointCodec)
  const TypedefsCodec = Vector(TypedefCodec)
  const TypesCodec = Tuple(EntryPointsCodec, TypedefsCodec)

  await fs.mkdir(outputFolder, { recursive: true })
  await fs.writeFile(
    path.join(outputFolder, "metadataTypes.scale"),
    TypesCodec.enc([metadataTypes.entryPoints, metadataTypes.typedefs]),
  )
  await fs.writeFile(
    path.join(outputFolder, "scale-import.d.ts"),
    `declare module "*.scale" {
      const content: string;
      export default content;
    }
    `,
  )
  await fs.writeFile(
    path.join(outputFolder, "descriptors.ts"),
    `///<reference path="./scale-import.d.ts"/>
${descriptorsFileContent}`,
  )
  await fs.writeFile(
    path.join(outputFolder, "common-types.ts"),
    typesFileContent,
  )
  await Promise.all(
    chains.map((chain, i) =>
      fs.writeFile(
        join(outputFolder, `${chain.key}.ts`),
        descriptorTypesFileContent[i],
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

  if (await fsExists(outDir)) {
    await fs.rm(outDir, { recursive: true })
  }

  await tsup.build({
    format: ["cjs", "esm"],
    entry: [path.join(srcDir, "index.ts")],
    loader: {
      ".scale": "binary",
    },
    platform: "neutral",
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
        "polkadot-api": "*"
      }
    }`,
  )
}

async function readWhitelist(filename: string): Promise<string[] | null> {
  if (!(await fsExists(filename))) {
    throw new Error("Whitelist file not found: " + filename)
  }

  const tmpDir = await mkdtemp(join(tmpdir(), "papi-"))
  try {
    await build({
      format: "esm",
      entry: {
        index: filename,
      },
      outDir: tmpDir,
      outExtension() {
        return { js: ".mjs" }
      },
      silent: true,
    })
    const { whitelist } = await import(join(tmpDir, "index.mjs"))
    return whitelist
  } finally {
    await rm(tmpDir, { recursive: true }).catch(console.error)
  }
}
