export const CHLOG_HEADER = "# Changelog\n\n## Unreleased\n\n"
export const NO_CHANGES = "## "

export const getPkgsWithChanges = async (pkgs: Record<string, string>) =>
  (
    await Promise.all(
      Object.entries(pkgs).map(async ([pkg, dir]) => {
        const chlog = await Bun.file(`packages/${dir}/CHANGELOG.md`).text()
        return chlog.startsWith(CHLOG_HEADER + NO_CHANGES) ? null : pkg
      }),
    )
  ).filter((k) => k != null)
