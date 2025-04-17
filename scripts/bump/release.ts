import { $ } from "bun"
import { PACKAGES } from "./consts"
import { CHLOG_HEADER, getPkgsWithChanges } from "./utils"

// ensure we are on root directory
// cd to it
const root = (await $`git rev-parse --show-toplevel`.quiet().text()).trim()
process.chdir(root)

const pkgsWithChanges = await getPkgsWithChanges(PACKAGES)

const todayStr = new Date().toISOString().slice(0, 10)

pkgsWithChanges.forEach(async (pkg) => {
  const dir = PACKAGES[pkg]!
  const chlogFile = Bun.file(`packages/${dir}/CHANGELOG.md`)
  const pkgJsonFile = Bun.file(`packages/${dir}/package.json`)
  const [chlog, pkgJson] = await Promise.all([
    chlogFile.text(),
    pkgJsonFile.text(),
  ])
  const parsedPkgJson = JSON.parse(pkgJson)
  const parsedVersion = (parsedPkgJson.version as string)
    .split(".")
    .map((v) => parseInt(v))
  if (chlog.slice(CHLOG_HEADER.length + 4).startsWith("Fixed"))
    parsedVersion[2]!++
  else {
    parsedVersion[1]!++
    parsedVersion[2] = 0
  }
  const newVersion = parsedVersion.join(".")
  parsedPkgJson.version = newVersion
  chlogFile.write(
    CHLOG_HEADER +
      `## ${newVersion} - ${todayStr}\n\n` +
      chlog.slice(CHLOG_HEADER.length),
  )
  pkgJsonFile.write(JSON.stringify(parsedPkgJson, null, 2) + "\n")
})
