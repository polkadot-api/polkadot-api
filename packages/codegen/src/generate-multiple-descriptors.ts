import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import type { V14, V15 } from "@polkadot-api/substrate-bindings"
import { DescriptorValues, generateDescriptors } from "./generate-descriptors"
import { generateTypes } from "./generate-types"
import { getUsedChecksums } from "./get-used-checksums"
import knownTypes, { KnownTypes } from "./known-types"
import { Variable, defaultDeclarations, getTypesBuilder } from "./types-builder"
import { applyWhitelist } from "./whitelist"
import { mapObject } from "@polkadot-api/utils"

export const generateMultipleDescriptors = (
  chains: Array<{
    key: string
    metadata: V14 | V15
    knownTypes: KnownTypes
  }>,
  paths: {
    client: string
    checksums: string
    types: string
    descriptorValues: string
  },
  options: {
    whitelist?: string[]
  } = {},
) => {
  const chainData = chains.map((chain) => {
    const metadata = options.whitelist
      ? applyWhitelist(chain.metadata, options.whitelist)
      : chain.metadata
    const builder = getChecksumBuilder(metadata)
    return {
      ...chain,
      metadata,
      builder,
      checksums: getUsedChecksums(metadata, builder),
      knownTypes: {
        ...knownTypes,
        ...chain.knownTypes,
      },
    }
  })
  resolveConflicts(chainData)

  const checksums = Array.from(
    new Set(chainData.flatMap((chain) => Array.from(chain.checksums))),
  )

  const declarations = defaultDeclarations()
  const chainFiles = chainData.map((chain) =>
    generateDescriptors(
      chain.metadata,
      checksums,
      getTypesBuilder(declarations, chain.metadata, chain.knownTypes),
      chain.builder,
      capitalize(chain.key),
      paths,
    ),
  )

  const descriptorsFileContent = generateDescriptorValuesContent(
    Object.fromEntries(
      chainFiles.map((file, i) => [chainData[i].key, file.descriptorValues]),
    ),
  )

  return {
    descriptorsFileContent,
    descriptorTypesFileContent: chainFiles.map((file) => file.descriptorTypes),
    checksums,
    typesFileContent: generateTypes(declarations, paths),
    publicTypes: getPublicTypes(declarations.variables),
  }
}

function getPublicTypes(variables: Map<string, Variable>) {
  return Array.from(variables.values())
    .filter((variable) => variable.type.startsWith("Enum<"))
    .map((variable) => variable.name)
}

function resolveConflicts(
  chainData: Array<{
    key: string
    checksums: Set<string>
    knownTypes: KnownTypes
  }>,
) {
  const usedNames = new Map<string, Map<string, Set<string>>>()

  chainData.forEach((chain) =>
    chain.checksums.forEach((checksum) => {
      const name = chain.knownTypes[checksum]
      if (!name) return
      if (!usedNames.has(name)) {
        usedNames.set(name, new Map())
      }
      if (!usedNames.get(name)!.has(chain.key)) {
        usedNames.get(name)!.set(chain.key, new Set())
      }
      usedNames.get(name)!.get(chain.key)!.add(checksum)
    }),
  )

  const conflictedChecksums = Array.from(usedNames.values()).flatMap(
    (chainToChecksums) => {
      const checksums = new Set(
        Array.from(chainToChecksums.values()).flatMap((v) => [...v]),
      )
      if (checksums.size === 1) return []
      const allAreTheSame = Array.from(chainToChecksums.values()).every(
        (chainChecksums) => chainChecksums.size === checksums.size,
      )
      if (allAreTheSame) return []

      return [...checksums]
    },
  )

  Array.from(new Set(conflictedChecksums)).forEach((checksum) =>
    chainData.forEach((chain) => {
      const name = chain.knownTypes[checksum]
      if (name) {
        chain.knownTypes[checksum] = capitalize(chain.key) + name
      }
    }),
  )
}

function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}

function generateDescriptorValuesContent(
  descriptorValues: Record<string, DescriptorValues>,
) {
  const usages: Record<string, number> = {}
  const countUsages = (obj: Record<string, any>): void =>
    Object.entries(obj).forEach(([key, value]) => {
      usages[key] = usages[key] ?? 0
      usages[key]++
      if (typeof value === "object") countUsages(value)
    })
  countUsages(descriptorValues)

  const tokens: Array<string> = []
  const tokenToIdx: Record<string, number> = {}
  const minifyKeys = <T extends Record<string | number, any>>(obj: T): T =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const newValue = typeof value === "number" ? value : minifyKeys(value)
        if (usages[key] <= 1) return [key, newValue]
        if (!(key in tokenToIdx)) {
          tokenToIdx[key] = tokens.length
          tokens.push(key)
        }
        return [tokenToIdx[key], newValue]
      }),
    ) as T
  const minified = mapObject(descriptorValues, minifyKeys)

  const getTreeKey = (tree: Record<string, unknown>): string =>
    Object.entries(tree)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([key, value]) =>
          `[${key}:${typeof value === "object" ? getTreeKey(value as any) : value}]`,
      )
      .join("")

  type Transformed = Record<string, number | Record<string, number>>
  /** Modifies in-place, changes type to Transformed */
  const findCommonTrees = (
    values: Array<Record<string, Record<string, unknown>>>,
  ) => {
    const treeUsages: Record<string, number> = {}
    const keys = values.map((obj) =>
      mapObject(obj, (tree) => {
        const key = getTreeKey(tree)
        treeUsages[key] = treeUsages[key] ?? 0
        treeUsages[key]++
        return key
      }),
    )

    const commonTrees: Array<Record<string, unknown>> = []
    const keyToCommonTree: Record<string, number> = {}
    values.forEach((obj, i) =>
      Object.entries(obj).forEach(([objKey, tree]) => {
        const key = keys[i][objKey]
        if (treeUsages[key] > 1) {
          if (!(key in keyToCommonTree)) {
            keyToCommonTree[key] = commonTrees.length
            commonTrees.push(tree)
          }
          ;(obj as Transformed)[objKey] = keyToCommonTree[key]
        }
      }),
    )

    return commonTrees
  }

  const commonTrees = findCommonTrees(
    Object.keys(Object.values(minified)[0]).flatMap((type) =>
      Object.values(minified).map((d) => d[type as keyof DescriptorValues]),
    ),
  )

  const data = JSON.stringify([minified, commonTrees, tokens])

  return `
    const [minified, commonTrees, tokens] = JSON.parse(\`${data}\`);

    const replaceTokens = <T>(obj: Record<string | number, T>): Record<string, T> =>
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const unwrappedValue =
            typeof value === "object" ? replaceTokens(value as any) : value
          const numericKey = Number(key)
          if (Number.isNaN(numericKey)) {
            return [key, unwrappedValue]
          }
          return [tokens[numericKey], unwrappedValue]
        }),
      ) as Record<string, T>
    const tokenizedCommonTrees = commonTrees.map(replaceTokens)
    
    const unwrap = (
      obj: Record<string, object | number>,
      depth: number,
    ): Record<string, object> =>
      depth === 0
        ? (obj as Record<string, object>)
        : Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key,
              unwrap(
                typeof value === "object" ? value : tokenizedCommonTrees[value],
                depth - 1,
              ),
            ]),
          )
    
    const getChainDescriptors = (key: string) =>
      unwrap(replaceTokens(minified[key]), 2)

    ${Object.keys(descriptorValues)
      .map(
        (key) =>
          `export const ${capitalize(key)} = getChainDescriptors("${key}")`,
      )
      .join("\n")}
  `
}
