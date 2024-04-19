import { getChecksumBuilder } from "@polkadot-api/metadata-builders"
import { V15 } from "@polkadot-api/substrate-bindings"
import { generateDescriptors } from "./generate-descriptors"
import { generateTypes } from "./generate-types"
import { getUsedChecksums } from "./get-used-checksums"
import knownTypes, { KnownTypes } from "./known-types"
import { Variable, defaultDeclarations, getTypesBuilder } from "./types-builder"
import { applyWhitelist } from "./whitelist"

export const generateMultipleDescriptors = (
  chains: Array<{
    key: string
    metadata: V15
    knownTypes: KnownTypes
  }>,
  paths: {
    client: string
    checksums: string
    types: string
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
  const descriptorsFileContent = chainData.map((chain) =>
    generateDescriptors(
      chain.metadata,
      checksums,
      getTypesBuilder(declarations, chain.metadata, chain.knownTypes),
      chain.builder,
      capitalize(chain.key),
      paths,
    ),
  )

  return {
    descriptorsFileContent,
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
