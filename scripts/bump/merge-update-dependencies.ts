import { $ } from "bun"
import { PACKAGES } from "./consts"

// ensure we are on root directory
// cd to it
const root = (await $`git rev-parse --show-toplevel`.quiet().text()).trim()
process.chdir(root)

const updateRegex =
  /^(?:(?<version_line>(?<version_start>[0-9\.]+(-[^ ]+)?)) - (?<date>[0-9\-]+))|(?:(?<version_line>(?<version_start>[0-9\.]+(-[^ ]+)?) to [0-9\.]+(-[^ ]+)?) - (?<date>[0-9\-]+))/

for (const name in PACKAGES) {
  const path = PACKAGES[name]!
  await transformChangelog(path)
}

async function transformChangelog(dir: string) {
  const file = await Bun.file(`packages/${dir}/CHANGELOG.md`).text()

  const [header, ...updateTexts] = file.split("\n## ")
  const updates = updateTexts.map(parseUpdate)

  const result: typeof updates = []
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i]!

    if (!update.onlyDependencies) {
      result.push(update)
      continue
    }

    let lastVersion: string | null = null
    while (updates[i + 1]?.onlyDependencies) {
      lastVersion = updates[i + 1]!.versionStart
      i++
    }
    if (lastVersion) {
      // `update.versionStart` should be fine because it's the first with "onlyDependencies"
      // if it was merged previously (i.e. it has a version range), it's impossible to fall in this branch.
      update.versionLine = `${lastVersion} to ${update.versionStart}`
    }
    result.push(update)
  }

  const updatedTexts = result.map((r) =>
    r.date
      ? `${r.versionLine} - ${r.date}${r.body}`
      : `${r.versionLine}${r.body}`,
  )

  const transformed = [header, ...updatedTexts].join("\n## ")
  if (file != transformed) {
    console.log(dir)
  }
  await Bun.file(`packages/${dir}/CHANGELOG.md`).write(transformed)
}

function parseUpdate(update: string) {
  if (update.startsWith("Unreleased")) {
    return {
      versionLine: "",
      versionStart: "",
      body: update,
      onlyDependencies: false,
    }
  }

  const res = updateRegex.exec(update)
  if (!res) throw new Error("Can't parse update '" + update)

  const body = update.slice(res[0].length)

  let onlyDependencies = false
  if (body.includes("- Update dependencies")) {
    const afterFirstPoint = body.slice(body.indexOf("-") + 1)
    onlyDependencies = !afterFirstPoint.includes("-")
  }

  return {
    versionLine: res.groups!.version_line!,
    versionStart: res.groups!.version_start!,
    date: res.groups!.date!,
    body,
    onlyDependencies,
  }
}
