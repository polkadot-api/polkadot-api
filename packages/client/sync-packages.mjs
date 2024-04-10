import * as knownChains from "@polkadot-api/known-chains"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

const fromId = (id) => [id, `@polkadot-api/${id}`]
export const reexports = [
  fromId("logs-provider"),
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
  const distPath = `./dist/${fileName}`
  newExports["./" + packageName] = {
    node: {
      production: {
        import: `${distPath}/${fileName}.mjs`,
        require: `${distPath}/min/${fileName}.js`,
        default: `${distPath}/${fileName}.js`,
      },
      import: `${distPath}/${fileName}.mjs`,
      require: `${distPath}/${fileName}.js`,
      default: `${distPath}/${fileName}.js`,
    },
    module: `${distPath}/${fileName}.mjs`,
    import: `${distPath}/${fileName}.mjs`,
    require: `${distPath}/${fileName}.js`,
    default: `${distPath}/${fileName}.js`,
  }

  const packageDir = join(...packageName.split("/"))
  const subpaths = packageName.split("/").length
  const toRoot =
    new Array(subpaths - 1).fill("..").join("/") + (subpaths === 1 ? "." : "/.")
  await mkdir(packageDir, { recursive: true })
  await writeFile(
    join(packageDir, "package.json"),
    JSON.stringify(
      {
        name: `polkadot-api_${packageName.replaceAll("/", "_")}`,
        types: `${toRoot}${distPath}/${fileName}.d.ts`,
        module: `${toRoot}${distPath}/${fileName}.mjs`,
        import: `${toRoot}${distPath}/${fileName}.mjs`,
        require: `${toRoot}${distPath}/${fileName}.js`,
        default: `${toRoot}${distPath}/${fileName}.js`,
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
