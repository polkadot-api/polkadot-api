import { anonymizeImports, anonymizeType } from "./anonymize"
import { CodeDeclarations } from "./types-builder"

export const generateTypes = (
  declarations: CodeDeclarations,
  paths: {
    client: string
  },
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

  const baseTypes = [...declarations.variables.values()]
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
