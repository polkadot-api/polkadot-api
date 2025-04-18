export const getDependenciesAndDependants = (
  directDeps: Record<string, string[]>,
): {
  dependencies: Map<string, Set<string>>
  dependants: Map<string, Set<string>>
} => {
  const dependencies = new Map<string, Set<string>>()
  const dependants = new Map<string, Set<string>>()
  const recursiveDeps = (pkg: string): Set<string> => {
    if (dependencies.has(pkg)) return dependencies.get(pkg)!
    const set = new Set<string>()
    directDeps[pkg]!.forEach((dep) => {
      set.add(dep)
      recursiveDeps(dep).forEach((k) => set.add(k))
    })
    set.delete(pkg) // avoid having itself
    dependencies.set(pkg, set)
    return set
  }
  Object.keys(directDeps).forEach((pkg) => recursiveDeps(pkg))

  dependencies.forEach((deps, pkg) =>
    deps.forEach((dep) => {
      if (!dependants.has(dep)) dependants.set(dep, new Set())
      dependants.get(dep)!.add(pkg)
    }),
  )
  return { dependencies, dependants }
}
