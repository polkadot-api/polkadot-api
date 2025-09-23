import {
  getChecksumBuilder,
  LookupEntry,
  Var,
} from "@polkadot-api/metadata-builders"
import { getTypesBuilder } from "./types-builder"

export function generateTypesFile(
  chains: Array<{
    builder: ReturnType<typeof getChecksumBuilder>
    typesBuilder: ReturnType<typeof getTypesBuilder>
    types: Map<string, LookupEntry>
  }>,
  names: Record<string, string>,
) {
  const getVarName = (chk: string) => `v${names[chk] ?? chk}`
  // const gentryetTypeName = (chk: string) => names[chk] ?? `I${chk}`

  let dependencies = new Map<
    string,
    [LookupEntry, ReturnType<typeof getChecksumBuilder>]
  >()
  const stringifyNode = (
    node: Var | LookupEntry,
    builder: ReturnType<typeof getChecksumBuilder>,
  ): string => {
    const entryName = (entry: LookupEntry) => {
      const chk = builder.buildDefinition(entry.id)!
      dependencies.set(chk, [entry, builder])
      return getVarName(chk)
    }
    const referenceFn = (name: string, entry: LookupEntry) =>
      `get ${name}() { return ${entryName(entry)}(); }`

    const id = "id" in node ? node.id : 0

    switch (node.type) {
      case "AccountId20":
      case "AccountId32":
      case "bitSequence":
      case "compact":
      case "primitive":
      case "void":
        return JSON.stringify(node)
      case "array":
        return `{
          id: ${id},
          type: "array",
          ${referenceFn("value", node.value)},
          len: ${node.len}
        }`
      case "option":
      case "sequence":
        return `{
          id: ${id},
          type: "${node.type}",
          ${referenceFn("value", node.value)},
        }`
      case "enum":
        return `{
          id: ${id},
          type: "enum",
          innerDocs: {},
          value: {
            ${Object.entries(node.value)
              .map(
                ([key, value]) =>
                  `"${key}": ${
                    value.type === "lookupEntry"
                      ? `{
                          type: "lookupEntry",
                          ${referenceFn("value", value.value)},
                          idx: ${value.idx}
                        }`
                      : `{
                        ...(${stringifyNode(value, builder)}),
                        idx: ${value.idx}
                      }`
                  }`,
              )
              .join(",")}
          }
        }`
      case "result":
        return `{
          id: ${id},
          type: "${node.type}",
          value: {
            ${referenceFn("ok", node.value.ok)},
            ${referenceFn("ko", node.value.ko)},
          }
        }`
      case "tuple":
        return `{
          id: ${id},
          type: "tuple",
          innerDocs: [],
          value: new Proxy([], {
            get(_t, prop) {
              const values = [
                ${node.value.map(entryName).join(",")}
              ];
              return values[prop as any]();
            },
          })
        }`
      case "struct":
        return `{
          id: ${id},
          type: "struct",
          innerDocs: {},
          value: {
            ${Object.entries(node.value)
              .map(([key, value]) => referenceFn(key, value))
              .join(",")}
          }
        }`
    }
  }

  const generated = new Set<string>()

  const variables: string[] = []
  // const types: string[] = []

  const clientImports = new Set([
    "LookupEntry",
    // "SS58String",
    // "FixedSizeBinary",
    // "Binary",
  ])
  for (const chain of chains) {
    for (let [chk, type] of chain.types) {
      if (generated.has(chk)) continue
      generated.add(chk)

      variables.push(
        `export function ${getVarName(chk)}(): LookupEntry { return (${stringifyNode(type, chain.builder)}) };`,
      )

      // const typeDef = chain.typesBuilder.buildDefinition(type.id)
      // typeDef.imports.client?.forEach((imp) => clientImports.add(imp))
      // types.push(`export type ${getTypeName(chk)} = ${typeDef.code}`)
    }
  }

  while (dependencies.size > 0) {
    const queue = new Map(dependencies)
    dependencies = new Map()
    for (const [chk, [entry, builder]] of queue) {
      if (generated.has(chk)) continue
      generated.add(chk)

      variables.push(
        `export function ${getVarName(chk)}(): LookupEntry { return (${stringifyNode(entry, builder)}) };`,
      )
    }
  }

  return `
    // @ts-nocheck
    import type {${[...clientImports].join(", ")}} from 'polkadot-api';

    ${variables.join("\n")}
  `
}
