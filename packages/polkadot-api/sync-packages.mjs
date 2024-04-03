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

const packageFiles = (await readdir("./src")).filter(
  (v) => v !== "index.ts" && v.endsWith(".ts"),
)

const newExports = {
  ".": packageJsonContent.exports["."],
}
for (const filename of packageFiles) {
  const packageName = filename.replace(".ts", "")
  const basePath = `./dist/${packageName}`
  newExports["./" + packageName] = {
    node: {
      production: {
        import: `${basePath}/${packageName}.mjs`,
        require: `${basePath}/min/${packageName}.js`,
        default: `${basePath}/${packageName}.js`,
      },
      import: `${basePath}/${packageName}.mjs`,
      require: `${basePath}/${packageName}.js`,
      default: `${basePath}/${packageName}.js`,
    },
    module: `${basePath}/${packageName}.mjs`,
    import: `${basePath}/${packageName}.mjs`,
    require: `${basePath}/${packageName}.js`,
    default: `${basePath}/${packageName}.js`,
  }

  await mkdir(join(".", packageName))
  await writeFile(
    join(".", packageName, "package.json"),
    JSON.stringify(
      {
        name: `polkadot-api/${packageName}`,
        types: `../dist/${packageName}/${packageName}.d.ts`,
        module: `../dist/${packageName}/${packageName}.mjs`,
        import: `../dist/${packageName}/${packageName}.mjs`,
        require: `../dist/${packageName}/${packageName}.js`,
        default: `../dist/${packageName}/${packageName}.js`,
      },
      null,
      2,
    ),
  )
}
newExports["./package.json"] = packageJsonContent.exports["./packageJson"]

packageJsonContent.exports = newExports

await writeFile("package.json", JSON.stringify(packageJsonContent, null, 2))
