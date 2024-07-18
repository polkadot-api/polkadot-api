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
  fromId("utils"),
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
for (const [packageName, source] of reexports) {
  const fileName = packageName.replaceAll("/", "_")
  newExports["./" + packageName] = {
    node: {
      import: `./dist/esm/reexports/${fileName}.mjs`,
      require: `./dist/reexports/${fileName}.js`,
      default: `./dist/reexports/${fileName}.js`,
    },
    module: `./dist/esm/reexports/${fileName}.mjs`,
    import: `./dist/esm/reexports/${fileName}.mjs`,
    require: `./dist/reexports/${fileName}.js`,
    default: `./dist/reexports/${fileName}.js`,
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
        require: `${toRoot}/dist/reexports/${fileName}.js`,
        default: `${toRoot}/dist/reexports/${fileName}.js`,
      },
      null,
      2,
    ) + "\n",
  )

  await writeFile(
    join(reexportsDir, `${fileName}.ts`),
    `export * from "${source}"\n`,
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
