import { V15 } from "@polkadot-api/substrate-bindings"
import { getUsedChecksums } from "./get-used-checksums"
import {
  generateDescriptors,
  getKnownTypesFromFileContent,
} from "./generate-descriptors"
import knownTypesContent from "./known-types"
import { getChecksumBuilder } from "@polkadot-api/metadata-builders"

export const generateMultipleDescriptors = (
  chains: Array<{
    key: string
    metadata: V15
    knownDeclarations: string
  }>,
  paths: {
    client: string
    checksums: string
  },
) => {
  const chainData = chains.map((chain) => {
    const builder = getChecksumBuilder(chain.metadata)
    return {
      ...chain,
      builder,
      checksums: getUsedChecksums(chain.metadata, builder),
      knownTypes: getKnownTypesFromFileContent(
        knownTypesContent + "\n\n" + chain.knownDeclarations,
      ),
    }
  })
  resolveConflicts(chainData)

  const checksums = Array.from(
    new Set(chainData.flatMap((chain) => Array.from(chain.checksums))),
  )

  return {
    descriptorsFileContent: chainData.map((chain) =>
      generateDescriptors(
        chain.metadata,
        chain.knownTypes,
        checksums,
        chain.builder,
        paths,
      ),
    ),
    checksums,
  }
}

function resolveConflicts(
  chainData: Array<{
    key: string
    checksums: Set<string>
    knownTypes: Map<string, string>
  }>,
) {
  const usedNames = new Map<string, Set<string>>()

  chainData.forEach((chain) =>
    chain.checksums.forEach((checksum) => {
      const name = chain.knownTypes.get(checksum)
      if (!name) return
      if (!usedNames.has(name)) {
        usedNames.set(name, new Set())
      }
      usedNames.get(name)!.add(checksum)
    }),
  )
  const conflictedChecksums = Array.from(usedNames.values())
    .filter((checksums) => checksums.size > 1)
    .flatMap((checksums) => Array.from(checksums))

  conflictedChecksums.forEach((checksum) =>
    chainData.forEach((chain) => {
      const name = chain.knownTypes.get(checksum)
      if (name) {
        chain.knownTypes.set(checksum, capitalize(chain.key) + name)
      }
    }),
  )
}

function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}
