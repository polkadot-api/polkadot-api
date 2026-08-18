import { $ } from "bun"
import { PACKAGES } from "./consts"
import { CHLOG_HEADER, getPkgsWithChanges } from "./utils"

const semver =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

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
  const parsedVersion = semver.exec(parsedPkgJson.version as string)
  if (parsedVersion == null) throw new Error(`Version parsing of ${pkg} failed`)
  const [_, maj, min, pat, pre] = parsedVersion
  let newVersion
  if (pre) {
    const [tag, ver] = pre.split(".")
    newVersion = `${maj}.${min}.${pat}-${tag}.${parseInt(ver!) + 1}`
  } else {
    if (chlog.slice(CHLOG_HEADER.length + 4).startsWith("Fixed"))
      newVersion = `${maj}.${min}.${parseInt(pat!) + 1}`
    else newVersion = `${maj}.${parseInt(min!) + 1}.0`
    if (process.env.WITH_PRERELEASE)
      newVersion += `-${process.env.WITH_PRERELEASE}.1`
  }
  parsedPkgJson.version = newVersion
  chlogFile.write(
    CHLOG_HEADER +
      `## ${newVersion} - ${todayStr}\n\n` +
      chlog.slice(CHLOG_HEADER.length),
  )
  pkgJsonFile.write(JSON.stringify(parsedPkgJson, null, 2) + "\n")
})
