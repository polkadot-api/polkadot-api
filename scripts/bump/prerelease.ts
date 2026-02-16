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
  const [major, minor, patch] = (pkgJson.version as string)
    .split(".")
    .slice(0, 3)
    .map((x) => parseInt(x)) // this works also with 2.0.0-rc.1 and things like that
  pkgJson.version = `${major!}.${minor!}.${patch! + 1}-canary.${commitHash}`
  pkgJsonFile.write(JSON.stringify(pkgJson, null, 2) + "\n")
})
