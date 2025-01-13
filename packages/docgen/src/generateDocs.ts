import { getMetadata, readPapiConfig } from "@polkadot-api/cli"
import { generateDocsDescriptors, FileTree } from "@polkadot-api/codegen"
import fs from "fs/promises"
import path from "path"
import { Application } from "typedoc"
import { generateIndex } from "@/generateIndex"

export const papiFolder = ".papi"

const docsDescriptorsFolder = path.join(papiFolder, "docsDescriptors")

export interface Options {
  config?: string
  output: string
}

async function generateFileTree(dir: string, tree: FileTree): Promise<void> {
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === "string") {
      await fs.writeFile(path.join(dir, `${key}.ts`), value, "utf8")
      continue
    }

    const newDir = path.join(dir, key)
    await fs.mkdir(newDir, { recursive: true })
    await generateFileTree(newDir, value)
  }
}

export async function generateDocs(opts: Options) {
  const config = await readPapiConfig(opts.config)
  if (!config) {
    throw new Error("Can't find the Polkadot-API configuration")
  }
  const sources = config.entries

  if (Object.keys(sources).length == 0) {
    console.log("No chains defined in config file")
  }

  console.log("Reading metadata")
  const chains = await Promise.all(
    Object.entries(sources).map(async ([key, source]) => ({
      key,
      metadata: (await getMetadata(source))!.metadata,
    })),
  )
  await fs.rm(opts.output, { recursive: true, force: true })
  await fs.mkdir(opts.output, { recursive: true })

  await Promise.all(
    chains.map(async (chain) => {
      console.log(`Generating TS descriptors for chain ${chain.key}`)
      const chainDescriptorsPath = path.join(docsDescriptorsFolder, chain.key)

      const result = await generateDocsDescriptors(chain.key, chain.metadata)

      await fs.rm(chainDescriptorsPath, { recursive: true, force: true })
      await fs.mkdir(chainDescriptorsPath, { recursive: true })

      const tsconfigPath = path.join(chainDescriptorsPath, "tsconfig.json")
      await fs.writeFile(tsconfigPath, getTsConfig(), "utf8")
      await generateFileTree(chainDescriptorsPath, result)

      console.log(`Running typedoc for chain ${chain.key}`)

      const cssFile = path.join(chainDescriptorsPath, "style.css")
      await fs.writeFile(cssFile, getCss(), "utf-8")

      const typedoc = await Application.bootstrapWithPlugins({
        entryPoints: [path.join(chainDescriptorsPath, "index.ts")],
        tsconfig: tsconfigPath,
        titleLink: "/",
        //@ts-ignore customTitle option comes from a plugin, not reflected in types
        customTitle: "All chains",
        cleanOutputDir: true,
        customCss: cssFile,
        name: chain.key,
        readme: undefined,
        plugin: ["typedoc-plugin-extras"],
      })

      const project = await typedoc.convert()
      if (!project) {
        throw new Error(`Typedoc convert failed for chain ${chain.key}`)
      }

      const chainOutDir = path.join(opts.output, chain.key)
      await fs.mkdir(chainOutDir, { recursive: true })
      await typedoc.generateDocs(project, chainOutDir)

      // index.html is currently useless, this is the easiest way to point to the
      // right starting page
      await fs.cp(
        path.join(chainOutDir, "modules.html"),
        path.join(chainOutDir, "index.html"),
        { force: true },
      )

      await fs.rm(chainDescriptorsPath, { recursive: true, force: true })
    }),
  )

  const indexFile = path.join(opts.output, "index.html")
  await fs.writeFile(
    indexFile,
    generateIndex({ networks: chains.map((chain) => chain.key) }),
    "utf-8",
  )

  await fs.rm(docsDescriptorsFolder, { recursive: true, force: true })
  console.log(`Docs available at path ${opts.output}`)
}

function getTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      baseUrl: ".",
      lib: ["es2021"],
      module: "commonjs",
      moduleResolution: "node",
      strict: true,
      skipLibCheck: true,
      target: "es2021",
    },
    include: ["./**/*.ts"],
  })
}

function getCss(): string {
  return `
.tsd-sources {
  display: none;
}
.tsd-navigation.settings { 
  display: none;
}
`
}
