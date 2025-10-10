import { $ } from "bun"
import { PACKAGES } from "./consts"

// ensure we are on root directory
// cd to it
const root = (await $`git rev-parse --show-toplevel`.quiet().text()).trim()
process.chdir(root)

const commitHash = (await $`git rev-parse --short=7 HEAD`.quiet().text()).trim()

Object.values(PACKAGES).forEach(async (pkgPath) => {
  const pkgJsonFile = Bun.file(`packages/${pkgPath}/package.json`)
  const pkgJson = await pkgJsonFile.text().then((v) => JSON.parse(v))
  const nextMajor = parseInt(pkgJson.version.split(".")[0]) + 1
  pkgJson.version = `${nextMajor}.0.0-canary.${commitHash}`
  pkgJsonFile.write(JSON.stringify(pkgJson, null, 2) + "\n")
})
