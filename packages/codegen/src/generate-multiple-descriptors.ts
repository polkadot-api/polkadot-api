import {
  getChecksumBuilder,
  getLookupFn,
  Var,
} from "@polkadot-api/metadata-builders"
import type {
  HexString,
  UnifiedMetadata,
} from "@polkadot-api/substrate-bindings"
import { generateChainTypes } from "./generate-chain-types"
import { generateTypesFile } from "./generate-types-file"
import { getUsedTypes } from "./get-used-types"
import { knownTypes, type KnownTypes } from "./known-types"
import { defaultDeclarations, getTypesBuilder } from "./types-builder"
import { applyWhitelist } from "./whitelist"
import { generateTypes } from "./generate-types"

export const generateMultipleDescriptors = (
  chains: Array<{
    key: string
    metadata: UnifiedMetadata
    knownTypes: KnownTypes
    genesis?: HexString
  }>,
  _paths: {
    client: string
    metadataTypes: string
    types: string
    descriptorValues: string
    common: string
  },
  options: {
    whitelist?: string[]
  } = {},
) => {
  const _chainData = chains.map((chain) => {
    const metadata = options.whitelist
      ? applyWhitelist(chain.metadata, options.whitelist)
      : chain.metadata
    const lookup = getLookupFn(metadata)
    const builder = getChecksumBuilder(lookup)
    const { types } = getUsedTypes(lookup, builder)
    return {
      ...chain,
      lookup,
      builder,
      types,
      knownTypes: {
        ...knownTypes,
        ...chain.knownTypes,
      },
    }
  })
  const names = getNames(_chainData)

  const declarations = defaultDeclarations()
  const chainData = _chainData.map((chain) => ({
    ...chain,
    typesBuilder: getTypesBuilder(
      declarations,
      chain.lookup,
      names,
      chain.builder,
    ),
  }))

  const typesFile = generateTypesFile(chainData, names)

  const chainFiles = chainData.map((chain) =>
    generateChainTypes(
      chain.lookup,
      chain.typesBuilder,
      chain.builder,
      chain.key,
    ),
  )

  const types = generateTypes(
    declarations,
    {
      client: "polkadot-api",
    },
    new Set(),
  )

  return {
    typesFile,
    types,
    chainFiles,
  }
}

function getNames(
  chainData: Array<{
    key: string
    types: Map<string, Var>
    knownTypes: KnownTypes
  }>,
) {
  // Name => checksum => chains
  const usedNames = new Map<string, Map<string, Set<string>>>()

  chainData.forEach((chain) =>
    Array.from(chain.types.keys()).forEach((checksum) => {
      const known = chain.knownTypes[checksum]
      if (!known) return
      const { name } = known
      if (!usedNames.has(name)) {
        usedNames.set(name, new Map())
      }
      if (!usedNames.get(name)!.has(checksum)) {
        usedNames.get(name)!.set(checksum, new Set())
      }
      usedNames.get(name)!.get(checksum)!.add(chain.key)
    }),
  )

  // Checksum => Name
  const result: Record<string, string> = {}
  for (const [name, usages] of usedNames) {
    const checksums = Array.from(usages.keys())
    if (checksums.length === 1) {
      result[checksums[0]] = name
      continue
    }

    // TODO use priority and prefixes
    checksums.forEach((chk, i) => (result[chk] = `${name}${i}`))
  }

  return result
}
