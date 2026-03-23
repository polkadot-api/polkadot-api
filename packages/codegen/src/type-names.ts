import { MetadataLookup } from "@polkadot-api/metadata-builders"
import { knownTypes, type KnownTypes } from "./known-types"

export function resolveTypeNames(
  chainData: Array<{
    lookup: MetadataLookup
    key: string
    checksums: string[]
    knownTypes: KnownTypes
  }>,
): {
  global: Record<string, string[]>
  byChain: Record<string, Record<string, string[]>>
} {
  const takenNames: Record<
    string,
    {
      checksum: string
      priority: number
      chains: Set<string>
    }
  > = {}

  // We allow one same checksum to have multiple names
  // e.g. When 5 chains conflict with the same name but for 2 different
  // checksums, they have the chain name prepended.
  const checksumToName: Record<string, Set<string>> = {}

  for (const chain of chainData) {
    chain.checksums.forEach((checksum, id) => {
      const knownType = chain.knownTypes[checksum] || knownTypes[checksum]
    })
  }

  return null as any
}
