import { $ } from "bun"
import { PACKAGES } from "./consts"
import { getDependenciesAndDependants } from "./get-dependencies"
import { getPkgsWithChanges, CHLOG_HEADER } from "./utils"

// ensure we are on root directory
// cd to it
const root = (await $`git rev-parse --show-toplevel`.quiet().text()).trim()
process.chdir(root)

const ADD_UPDATE_DEPS = "### Fixed\n\n- Update dependencies\n\n"

export const DIRECT_DEPS = Object.fromEntries(
  await Promise.all(
    Object.entries(PACKAGES).map(async ([pkg, dir]) => {
      const { dependencies } = JSON.parse(
        await Bun.file(`packages/${dir}/package.json`).text(),
      )
      return [
        pkg,
        Object.keys(dependencies ?? {}).filter((k) => k in PACKAGES),
      ] satisfies [string, string[]]
    }),
  ),
)

const { dependants } = getDependenciesAndDependants(DIRECT_DEPS)

const pkgsWithChanges = await getPkgsWithChanges(PACKAGES)
const pkgsToAddUpdateDeps = new Set(
  dependants
    .entries()
    .filter(([pkg]) => pkgsWithChanges.includes(pkg))
    .flatMap(([, v]) =>
      // only add `Update dependencies` if there are no other changes
      Array.from(v).filter((pkg) => !pkgsWithChanges.includes(pkg)),
    ),
)

pkgsToAddUpdateDeps.forEach(async (pkg) => {
  const dir = PACKAGES[pkg]!
  const file = Bun.file(`packages/${dir}/CHANGELOG.md`)
  const chlog = await file.text()
  const newChlog =
    CHLOG_HEADER + ADD_UPDATE_DEPS + chlog.slice(CHLOG_HEADER.length)
  file.write(newChlog)
})
