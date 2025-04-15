import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import {
  EntryPoint,
  mapEntryPointReferences,
  mapReferences,
  TypedefNode,
} from "@polkadot-api/metadata-compatibility"
import type { HexString, V14, V15 } from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import {
  capitalize,
  DescriptorValues,
  generateDescriptors,
} from "./generate-descriptors"
import { generateTypes } from "./generate-types"
import { getUsedTypes } from "./get-used-types"
import { knownTypes, type KnownTypes } from "./known-types"
import { defaultDeclarations, getTypesBuilder, Variable } from "./types-builder"
import { applyWhitelist } from "./whitelist"

export const generateMultipleDescriptors = (
  chains: Array<{
    key: string
    metadata: V14 | V15
    knownTypes: KnownTypes
    genesis?: HexString
  }>,
  paths: {
    client: string
    metadataTypes: string
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
    const lookup = getLookupFn(metadata)
    const builder = getChecksumBuilder(lookup)
    const { checksums, types, entryPoints } = getUsedTypes(lookup, builder)
    return {
      ...chain,
      lookup,
      builder,
      checksums,
      types,
      entryPoints,
      knownTypes: {
        ...knownTypes,
        ...chain.knownTypes,
      },
    }
  })
  resolveConflicts(chainData)
  const types = mergeTypes(chainData)

  const declarations = defaultDeclarations()
  const chainFiles = chainData.map((chain) =>
    generateDescriptors(
      chain.lookup,
      types.checksumToIdx,
      getTypesBuilder(
        declarations,
        chain.lookup,
        chain.knownTypes,
        chain.builder,
      ),
      chain.builder,
      chain.key,
      paths,
      chain.genesis,
    ),
  )

  const descriptorsFileContent = generateDescriptorValuesContent(
    Object.fromEntries(
      chainFiles.map((file, i) => [chainData[i].key, file.descriptorValues]),
    ),
  )

  return {
    descriptorsFileContent,
    metadataTypes: types,
    descriptorTypesFiles: chainFiles.map((file) => ({
      content: file.descriptorTypes,
      exports: file.exports,
    })),
    typesFileContent: generateTypes(
      declarations,
      paths,
      new Set(chainFiles.map((x) => x.commonTypeImports).flat()),
    ),
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
    checksums: string[]
    knownTypes: KnownTypes
  }>,
) {
  // Name => chain => checksum
  const usedNames = new Map<string, Map<string, Set<string>>>()

  chainData.forEach((chain) =>
    chain.checksums.forEach((checksum) => {
      const known = chain.knownTypes[checksum]
      if (!known) return
      const { name } = known
      if (!usedNames.has(name)) {
        usedNames.set(name, new Map())
      }
      if (!usedNames.get(name)!.has(chain.key)) {
        usedNames.get(name)!.set(chain.key, new Set())
      }
      usedNames.get(name)!.get(chain.key)!.add(checksum)
    }),
  )

  const conflictedNames = Array.from(usedNames.entries())
    .filter(([_, chainToChecksums]) => {
      const checksums = new Set(
        Array.from(chainToChecksums.values()).flatMap((v) => [...v]),
      )
      if (checksums.size === 1) return false
      const allAreTheSame = Array.from(chainToChecksums.values()).every(
        (chainChecksums) => chainChecksums.size === checksums.size,
      )
      if (allAreTheSame) return false
      return true
    })
    .map(([name]) => name)

  conflictedNames.forEach((name) => {
    const nameChecksums = Array.from(
      new Set(
        Array.from(usedNames.get(name)?.values() ?? []).flatMap((v) =>
          Array.from(v),
        ),
      ),
    )

    const checksumMaxPriority = nameChecksums.map((checksum) => ({
      checksum,
      priority: chainData
        .map((chain) => chain.knownTypes[checksum]?.priority ?? 0)
        .reduce((a, b) => Math.max(a, b), 0),
    }))
    const absoluteMax = checksumMaxPriority
      .map((v) => v.priority)
      .reduce((a, b) => Math.max(a, b), 0)
    const checksumsLowPriority = checksumMaxPriority.filter(
      (v) => v.priority !== absoluteMax,
    )

    const checksumsChangingName =
      checksumsLowPriority.length === checksumMaxPriority.length - 1
        ? checksumsLowPriority
        : checksumMaxPriority

    chainData.forEach((chain) =>
      checksumsChangingName.forEach(({ checksum }) => {
        if (!chain.knownTypes[checksum]) return
        chain.knownTypes[checksum] = {
          name: capitalize(chain.key) + name,
          priority: chain.knownTypes[checksum].priority,
        }
      }),
    )
  })
}

function mergeTypes(
  chainData: Array<{
    types: Map<string, TypedefNode>
    entryPoints: Map<string, EntryPoint>
    checksums: string[]
  }>,
) {
  const typedefs: Array<[TypedefNode, string[]]> = []
  const entryPoints: Array<[EntryPoint, string[]]> = []
  const loookupToTypedefIdx: Map<string, number> = new Map()
  const checksumToIdx: Map<string, number> = new Map()

  chainData.forEach(({ types, entryPoints: chainEntryPoints, checksums }) => {
    for (const entry of types.entries()) {
      const [checksum, value] = entry
      if (loookupToTypedefIdx.has(checksum)) continue
      loookupToTypedefIdx.set(checksum, typedefs.length)
      typedefs.push([value, checksums])
    }
    for (const entry of chainEntryPoints.entries()) {
      const [checksum, value] = entry
      if (checksumToIdx.has(checksum)) continue
      checksumToIdx.set(checksum, entryPoints.length)
      entryPoints.push([value, checksums])
    }
  })

  // Update indices to the new one
  const updatedTypedefs = typedefs.map(([typedef, checksums]) =>
    mapReferences(typedef, (id) => loookupToTypedefIdx.get(checksums[id])!),
  )
  const updatedEntryPoints = entryPoints.map(([entryPoint, checksums]) =>
    mapEntryPointReferences(
      entryPoint,
      (id) => loookupToTypedefIdx.get(checksums[id])!,
    ),
  )

  return {
    typedefs: updatedTypedefs,
    entryPoints: updatedEntryPoints,
    checksumToIdx,
  }
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
  /**
   * Modifies in-place, changes type to Transformed.
   */
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
