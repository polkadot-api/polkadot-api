import { CodeDeclarations } from "./types-builder"

export const generateTypes = (
  declarations: CodeDeclarations,
  paths: {
    client: string
  },
) => {
  const clientImports = [
    "Enum",
    "OutputEnum",
    "_Enum",
    "GetEnum",
    "FixedSizeBinary",
    "FixedSizeArray",
    "Binary",
    ...declarations.imports,
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
  
  type AnonymousEnum<T extends {}> = T & {
    __anonymous: true
  }
  
  type MyTuple<T> = [T, ...T[]]
  
  type SeparateUndefined<T> = undefined extends T
    ? undefined | Exclude<T, undefined>
    : T
  
  type Anonymize<T> = SeparateUndefined<
    T extends FixedSizeBinary<infer L> ? FixedSizeBinary<L> :
    T extends
      | string
      | number
      | bigint
      | boolean
      | void
      | undefined
      | null
      | symbol
      | Binary
      | Uint8Array
      | OutputEnum<{ type: string; value: any }>
      ? T
      : T extends AnonymousEnum<infer V>
        ? Enum<V>
        : T extends MyTuple<any>
          ? {
              [K in keyof T]: T[K]
            }
          : T extends []
            ? []
            : T extends FixedSizeArray<infer L, infer T>
              ? number extends L
                ? Array<T>
                : FixedSizeArray<L, T>
              : {
                  [K in keyof T & string]: T[K]
                }
  >
  
  ${baseTypes}
  `
}
