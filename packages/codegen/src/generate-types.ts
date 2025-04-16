import { anonymizeImports, anonymizeType } from "./anonymize"
import { CodeDeclarations, Variable } from "./types-builder"

const getTypeDependencies = (input: string) =>
  new Set([...input.matchAll(/Anonymize<(I\w*)>/gm)].map((x) => x[1].slice(1)))

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
    iDependencies.forEach((dependencyChecksum) => {
      const s = dependants.get(dependencyChecksum)
      if (s) {
        s.add(checksum)
        toRemove.delete(dependencyChecksum)
      } else {
        dependants.set(dependencyChecksum, new Set([checksum]))
        if (!commonTypeImports.has(variables.get(dependencyChecksum)!.name))
          toRemove.add(dependencyChecksum)
      }
    })
  })

  while (true) {
    const nonDependants = [...toRemove].filter((item) =>
      [...(dependencies.get(item) ?? [])].every((x) => !toRemove.has(x)),
    )

    if (!nonDependants.length) break

    nonDependants.forEach((checksum) => {
      const variableToInline = variables.get(checksum)!
      const [target] = [...dependants.get(checksum)!]
      const variable = variables.get(target)!

      const newType = variableToInline.type.startsWith("AnonymousEnum<")
        ? variableToInline.type.slice(9) // "Anonymous".length
        : variableToInline.type

      variable.type = variable.type.replaceAll(
        `Anonymize<${variableToInline.name}>`,
        newType,
      )
      variables.delete(checksum)
      toRemove.delete(checksum)
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
