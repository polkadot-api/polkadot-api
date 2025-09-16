import * as knownChains from "@polkadot-api/known-chains"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

const fromId = (id) => [id, `@polkadot-api/${id}`]
export const reexports = [
  fromId("logs-provider"),
  fromId("polkadot-sdk-compat"),
  fromId("pjs-signer"),
  fromId("signer"),
  fromId("sm-provider"),
  fromId("ws-provider"),
  fromId("ws-provider/node"),
  fromId("ws-provider/web"),
  ["chains", "@polkadot-api/known-chains"],
  ...Object.keys(knownChains).map((chainName) => [
    `chains/${chainName}`,
    `@polkadot-api/known-chains/${chainName}`,
  ]),
  fromId("smoldot"),
  fromId("smoldot/worker"),
  fromId("smoldot/from-worker"),
  fromId("smoldot/node-worker"),
  fromId("smoldot/from-node-worker"),
  fromId("utils"),
  [
    "ink",
    "@polkadot-api/ink-contracts",
    "{ getInkClient, type InkDescriptors }",
  ],
]

const packageJsonContent = JSON.parse(await readFile("./package.json", "utf-8"))

const preExistingPackages = Object.keys(packageJsonContent.exports).filter(
  (path) => path !== "." && path !== "./package.json",
)
await Promise.all(
  preExistingPackages.map(async (path) =>
    rm(path, { recursive: true }).catch(() => {}),
  ),
)
const reexportsDir = join("src", "reexports")
await rm(reexportsDir, { recursive: true }).catch(() => {})
await mkdir(reexportsDir, { recursive: true })

const newExports = {
  ".": packageJsonContent.exports["."],
}
for (const [packageName, source, symbols = "*"] of reexports) {
  const components = packageName.split("/")
  const packageNameWithGlob =
    components.length === 1
      ? packageName
      : components.slice(0, -1).join("/") + "/*"
  const fileName = packageName.replaceAll("/", "_")
  const fileNameWithGlob = packageNameWithGlob.replaceAll("/", "_")
  newExports["./" + packageNameWithGlob] = {
    types: `./dist/reexports/${fileNameWithGlob}.d.ts`,
    node: {
      import: `./dist/esm/reexports/${fileNameWithGlob}.mjs`,
      require: `./dist/reexports/${fileNameWithGlob}.js`,
      default: `./dist/reexports/${fileNameWithGlob}.js`,
    },
    module: `./dist/esm/reexports/${fileNameWithGlob}.mjs`,
    import: `./dist/esm/reexports/${fileNameWithGlob}.mjs`,
    require: `./dist/reexports/${fileNameWithGlob}.js`,
    default: `./dist/reexports/${fileNameWithGlob}.js`,
  }

  const packageDir = join(...packageName.split("/"))
  const subpaths = packageName.split("/").length
  const toRoot = new Array(subpaths).fill("..").join("/") || "."
  await mkdir(packageDir, { recursive: true })
  await writeFile(
    join(packageDir, "package.json"),
    JSON.stringify(
      {
        name: `polkadot-api_${packageName.replaceAll("/", "_")}`,
        types: `${toRoot}/dist/reexports/${fileName}.d.ts`,
        module: `${toRoot}/dist/esm/reexports/${fileName}.mjs`,
        import: `${toRoot}/dist/esm/reexports/${fileName}.mjs`,
        browser: `${toRoot}/dist/esm/reexports/${fileName}.mjs`,
        require: `${toRoot}/dist/reexports/${fileName}.js`,
        default: `${toRoot}/dist/reexports/${fileName}.js`,
      },
      null,
      2,
    ) + "\n",
  )

  await writeFile(
    join(reexportsDir, `${fileName}.ts`),
    `export ${symbols} from "${source}"\n`,
  )
}
newExports["./package.json"] = packageJsonContent.exports["./packageJson"]

packageJsonContent.exports = newExports
packageJsonContent.files = [
  "dist",
  "bin",
  ...new Set(reexports.map(([name]) => name.split("/")[0])),
]

await writeFile(
  "package.json",
  JSON.stringify(packageJsonContent, null, 2) + "\n",
)
