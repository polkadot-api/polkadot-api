import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

const packageJsonContent = JSON.parse(await readFile("./package.json", "utf-8"))

const preExistingPackages = Object.keys(packageJsonContent.exports).filter(
  (path) => path !== "." && path !== "./package.json",
)
await Promise.all(
  preExistingPackages.map(async (path) =>
    rm(path, { recursive: true }).catch(() => {}),
  ),
)

const specFiles = await readdir("./specs")

const newExports = {
  ".": packageJsonContent.exports["."],
}
for (const filename of specFiles) {
  const packageName = filename.replace(".json", "")
  const basePath = `./dist/${packageName}`
  newExports["./" + packageName] = {
    module: `${basePath}/${packageName}.mjs`,
    import: `${basePath}/${packageName}.mjs`,
    require: `${basePath}/${packageName}.js`,
    default: `${basePath}/${packageName}.js`,
  }

  await mkdir(join(".", packageName), { recursive: true })
  await writeFile(
    join(".", packageName, "package.json"),
    JSON.stringify(
      {
        name: `@polkadot-api/known-chains-${packageName}`,
        types: `../dist/${packageName}/${packageName}.d.ts`,
        module: `../dist/${packageName}/${packageName}.mjs`,
        import: `../dist/${packageName}/${packageName}.mjs`,
        require: `../dist/${packageName}/${packageName}.js`,
        default: `../dist/${packageName}/${packageName}.js`,
      },
      null,
      2,
    ) + "\n",
  )
}
newExports["./package.json"] = packageJsonContent.exports["./packageJson"]

await writeFile(
  join("src", "index.ts"),
  specFiles
    .map((filename) => {
      const packageName = filename.replace(".json", "")
      return `export { chainSpec as ${packageName} } from "./specs/${packageName}"`
    })
    .join("\n") + "\n",
)

packageJsonContent.exports = newExports
packageJsonContent.files = [
  "dist",
  ...specFiles.map((file) => file.replace(".json", "")),
]

await writeFile(
  "package.json",
  JSON.stringify(packageJsonContent, null, 2) + "\n",
)
