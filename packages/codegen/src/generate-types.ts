import { anonymizeImports, anonymizeType } from "./anonymize"
import { CodeDeclarations, Variable } from "./types-builder"

const getTypeDependencies = (input: string) =>
  new Set([...input.matchAll(/Anonymize<(I\w*)>/gm)].map((x) => x[1]))

const optimizeVariables = (
  variables: Map<string, Variable>,
  commonTypeImports: Set<string>,
) => {
  const dependants = new Map<string, Set<string>>()
  const dependencies = new Map<string, Set<string>>()

  const toRemove = new Set<string>()

  ;[...variables.entries()].forEach(([checksum, { type }]) => {
    const iDependencies = getTypeDependencies(type)
    dependencies.set(checksum, iDependencies)
    iDependencies.forEach((preChecksum) => {
      const dependencyChecksum = preChecksum.slice(1)
      const s = dependants.get(dependencyChecksum)
      if (s) {
        s.add(checksum)
        toRemove.delete(dependencyChecksum)
      } else {
        dependants.set(dependencyChecksum, new Set([checksum]))
        if (!commonTypeImports.has(dependencyChecksum))
          toRemove.add(dependencyChecksum)
      }
    })
  })

  let roundIdx = 0
  while (true) {
    console.log({ roundIdx })
    const nonDependants = [...toRemove].filter((item) =>
      [...(dependencies.get(item) ?? [])].every((x) => !toRemove.has(x)),
    )

    if (!nonDependants.length) break

    nonDependants.forEach((x) => {
      const [target] = [...dependants.get(x)!]
      console.log(target, x)
      const variable = variables.get(target)!
      variable.type = variable.type.replaceAll(
        `Anonymize<${x}>`,
        variables.get(x)!.type,
      )
      variables.delete(x)
      toRemove.delete(x)
    })
  }

  return variables
}

export const generateTypes = (
  declarations: CodeDeclarations,
  paths: {
    client: string
  },
  commonTypeImports: Set<string>,
) => {
  const clientImports = [
    ...new Set([
      "Enum",
      "_Enum",
      "GetEnum",
      ...declarations.imports,
      ...anonymizeImports,
    ]),
  ]

  const imports = `import {${clientImports.join(", ")}} from "${paths.client}";`
  const variables = optimizeVariables(declarations.variables, commonTypeImports)

  const baseTypes = [...variables.values()]
    .map(({ name, type }) =>
      type.startsWith("Enum<")
        ? `export type ${name} = ${type};\nexport const ${name} = _Enum as unknown as GetEnum<${name}>;`
        : `export type ${name} = ${type};`,
    )
    .join("\n\n")

  return `${imports}

  ${anonymizeType}

  ${baseTypes}
  `
}
