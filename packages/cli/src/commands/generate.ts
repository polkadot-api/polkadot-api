import { getMetadata } from "@/metadata"
import { readPapiConfig } from "@/papiConfig"
import {
  generateInkTypes,
  generateMultipleDescriptors,
} from "@polkadot-api/codegen"
import {
  EntryPointCodec,
  TypedefCodec,
} from "@polkadot-api/metadata-compatibility"
import {
  Binary,
  h64,
  Tuple,
  V14,
  V15,
  Vector,
} from "@polkadot-api/substrate-bindings"
import { existsSync } from "fs"
import fsExists from "fs.promises.exists"
import fs, { mkdtemp, rm } from "fs/promises"
import { tmpdir } from "os"
import path, { join } from "path"
import process from "process"
import tsc from "tsc-prog"
import tsup, { build } from "tsup"
import { updatePackage } from "write-package"
import { CommonOptions } from "./commonOptions"
import { spawn } from "child_process"
import { readPackage } from "read-pkg"
import { detectPackageManager } from "../packageManager"
import { getInkLookup } from "@polkadot-api/ink-contracts"

export interface GenerateOptions extends CommonOptions {
  clientLibrary?: string
  whitelist?: string
}

export async function generate(opts: GenerateOptions) {
  if (process.env.PAPI_SKIP_GENERATE) {
    return
  }

  const config = await readPapiConfig(opts.config)
  if (!config) {
    throw new Error("Can't find the Polkadot-API configuration")
  }
  const sources = config.entries

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

  console.log(`Generating descriptors`)
  await cleanDescriptorsPackage(config.descriptorPath)
  const descriptorsDir = join(process.cwd(), config.descriptorPath)

  const clientPath = opts.clientLibrary ?? "polkadot-api"

  const whitelist = opts.whitelist ? await readWhitelist(opts.whitelist) : null
  const descriptorSrcDir = join(descriptorsDir, "src")
  const hash = await outputCodegen(
    chains,
    descriptorSrcDir,
    clientPath,
    whitelist,
  )

  if (config.ink) {
    outputInkCodegen(config.ink, descriptorSrcDir)
  }

  await replacePackageJson(descriptorsDir, hash)
  await compileCodegen(descriptorsDir)
  await fs.rm(descriptorSrcDir, { recursive: true })
  await runInstall()
  await flushBundlerCache()
}

async function cleanDescriptorsPackage(path: string) {
  const descriptorsDir = join(process.cwd(), path)
  if (!existsSync(descriptorsDir)) {
    await fs.mkdir(descriptorsDir, { recursive: true })

    // We have to keep the package.json in git because otherwise npm install on a fresh repo would fail
    await fs.writeFile(
      join(descriptorsDir, ".gitignore"),
      "*\n!.gitignore\n!package.json",
    )
  }

  const [packageJson, protocol] = await Promise.all([
    readPackage(),
    getPackageProtocol(),
  ])

  const packageSource = `${protocol}:${path}`
  const currentSource = packageJson.dependencies?.["@polkadot-api/descriptors"]
  if (currentSource !== packageSource) {
    await updatePackage({
      dependencies: {
        "@polkadot-api/descriptors": packageSource,
      },
    })
  }

  const distDir = join(descriptorsDir, "dist")
  if (existsSync(distDir)) {
    await fs.rm(distDir, { recursive: true })
  }
}

async function getPackageProtocol() {
  const { packageManager, version } = await detectPackageManager()

  switch (packageManager) {
    case "yarn":
      const yarnMajorVersion = Number(version.split(".").at(0))

      return yarnMajorVersion >= 2 ? "portal" : "file"
    default:
      return "file"
  }
}

async function runInstall() {
  const { executable } = await detectPackageManager()
  console.log(`${executable} install`)
  const child = spawn(executable, ["install"], {
    stdio: "inherit",
    env: {
      ...process.env,
      PAPI_SKIP_GENERATE: "true",
    },
  })
  await new Promise((resolve) => child.on("close", resolve))
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
    descriptorTypesFiles,
    metadataTypes,
    typesFileContent,
    publicTypes,
  } = generateMultipleDescriptors(
    chains,
    {
      client: clientPath,
      metadataTypes: "./metadataTypes",
      types: "./common-types",
      descriptorValues: "./descriptors",
    },
    {
      whitelist: whitelist ?? undefined,
    },
  )
  const hash = h64(
    Binary.fromText(
      Array.from(metadataTypes.checksumToIdx.keys()).join(""),
    ).asBytes(),
  )

  const EntryPointsCodec = Vector(EntryPointCodec)
  const TypedefsCodec = Vector(TypedefCodec)
  const TypesCodec = Tuple(EntryPointsCodec, TypedefsCodec)

  await fs.mkdir(outputFolder, { recursive: true })

  // Going through base64 conversion instead of using binary loader because of esbuild issue
  // https://github.com/evanw/esbuild/issues/3894
  const metadataTypesBase64 = Buffer.from(
    TypesCodec.enc([metadataTypes.entryPoints, metadataTypes.typedefs]),
  ).toString("base64")
  await fs.writeFile(
    path.join(outputFolder, "metadataTypes.ts"),
    `
const content = "${metadataTypesBase64}"
export default content
    `,
  )
  await fs.writeFile(
    path.join(outputFolder, "descriptors.ts"),
    descriptorsFileContent,
  )
  await fs.writeFile(
    path.join(outputFolder, "common-types.ts"),
    typesFileContent,
  )
  await Promise.all(
    chains.map((chain, i) =>
      fs.writeFile(
        join(outputFolder, `${chain.key}.ts`),
        descriptorTypesFiles[i].content,
      ),
    ),
  )
  await generateIndex(
    outputFolder,
    chains.map((chain) => chain.key),
    descriptorTypesFiles.map((d) => d.exports),
    publicTypes,
  )

  return hash
}

async function outputInkCodegen(
  contracts: Record<string, string>,
  outputFolder: string,
) {
  const contractsFolder = join(outputFolder, "contracts")
  if (!existsSync(contractsFolder))
    await fs.mkdir(contractsFolder, { recursive: true })

  const imports: string[] = []
  for (const [key, metadata] of Object.entries(contracts)) {
    try {
      const types = generateInkTypes(
        getInkLookup(JSON.parse(await fs.readFile(metadata, "utf-8"))),
      )
      await fs.writeFile(join(contractsFolder, `${key}.ts`), types)
      imports.push(`export { descriptor as ${key} } from './${key}.ts'`)
    } catch (ex) {
      console.error("Exception when generating descriptors for contract " + key)
      console.error(ex)
    }
  }

  await fs.writeFile(
    join(contractsFolder, `index.ts`),
    imports.join("\n") + "\n",
  )

  fs.appendFile(
    join(outputFolder, "index.ts"),
    `
    export * as contracts from './contracts';
    `,
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
  exports: string[][],
  publicTypes: string[],
) => {
  const indexTs = [
    ...keys.flatMap((key, i) => [
      `export { ${exports[i].join(",")} } from "./${key}";`,
      `export type * from "./${key}";`,
    ]),
    `export {`,
    publicTypes.join(", "),
    `} from './common-types';`,
  ].join("\n")
  await fs.writeFile(join(path, "index.ts"), indexTs)
}

async function replacePackageJson(descriptorsDir: string, version: bigint) {
  await fs.writeFile(
    join(descriptorsDir, "package.json"),
    `{
  "version": "0.1.0-autogenerated.${version}",
  "name": "@polkadot-api/descriptors",
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "module": "./dist/index.mjs",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
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
}
`,
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

async function flushBundlerCache() {
  try {
    const viteMetadata = join(
      process.cwd(),
      "node_modules",
      ".vite",
      "deps",
      "_metadata.json",
    )
    if (await fsExists(viteMetadata)) {
      await rm(viteMetadata)
    }
  } catch (ex) {
    console.error(ex)
  }
}
