import { MetadataLookup } from "@polkadot-api/metadata-builders"
import { type KnownTypes } from "./known-types"

type NameCandidate = {
  checksum: string
  name: string
  priority: number
  chainKey: string
  path: string[] | null
}

export function resolveTypeNames(
  chainData: Array<{
    key: string
    lookup: MetadataLookup
    checksums: string[]
    knownTypes: KnownTypes
  }>,
): {
  global: Record<string, string[]>
  byChain: Record<string, Record<string, string[]>>
} {
  // Step 1: Collect all name candidates from all chains
  const candidates: NameCandidate[] = []
  const checksumChains = new Map<string, Set<string>>() // checksum -> chains using it

  for (const chain of chainData) {
    // Group type IDs by checksum (same checksum can appear at multiple IDs)
    const checksumToTypeIds = new Map<string, number[]>()

    for (let typeId = 0; typeId < chain.checksums.length; typeId++) {
      const checksum = chain.checksums[typeId]
      if (!checksum) continue

      if (!checksumToTypeIds.has(checksum)) {
        checksumToTypeIds.set(checksum, [])
      }
      checksumToTypeIds.get(checksum)!.push(typeId)

      // Track which chains use this checksum
      if (!checksumChains.has(checksum)) {
        checksumChains.set(checksum, new Set())
      }
      checksumChains.get(checksum)!.add(chain.key)
    }

    for (const [checksum, typeIds] of checksumToTypeIds) {
      // Add known type name if exists
      if (chain.knownTypes[checksum]) {
        const { name, priority } = chain.knownTypes[checksum]
        candidates.push({
          checksum,
          name,
          priority,
          chainKey: chain.key,
          path: null,
        })
      }

      // Add path-derived names for each unique path
      const seenPaths = new Set<string>()
      for (const typeId of typeIds) {
        const entry = chain.lookup.metadata.lookup[typeId]
        if (!entry || entry.path.length === 0) continue

        const pathKey = entry.path.join(".")
        if (seenPaths.has(pathKey)) continue
        seenPaths.add(pathKey)

        const name = deriveNameFromPath(entry.path)
        candidates.push({
          checksum,
          name,
          priority: 0,
          chainKey: chain.key,
          path: entry.path,
        })
      }
    }
  }

  // Step 2: Group candidates by name to find conflicts
  const candidatesByName = new Map<string, NameCandidate[]>()
  for (const c of candidates) {
    if (!candidatesByName.has(c.name)) {
      candidatesByName.set(c.name, [])
    }
    candidatesByName.get(c.name)!.push(c)
  }

  // Step 3: Resolve conflicts and assign names
  // Result: chainKey -> checksum -> Set<names>
  const resolved = new Map<string, Map<string, Set<string>>>()
  const takenNames = new Map<string, string>() // name -> checksum that owns it

  const addName = (chainKey: string, checksum: string, name: string) => {
    if (!resolved.has(chainKey)) {
      resolved.set(chainKey, new Map())
    }
    const chainMap = resolved.get(chainKey)!
    if (!chainMap.has(checksum)) {
      chainMap.set(checksum, new Set())
    }
    chainMap.get(checksum)!.add(name)
  }

  // Process names in order of max priority (highest first) for predictability
  const sortedNames = [...candidatesByName.entries()].sort((a, b) => {
    const maxPriorityA = Math.max(...a[1].map((c) => c.priority))
    const maxPriorityB = Math.max(...b[1].map((c) => c.priority))
    return maxPriorityB - maxPriorityA
  })

  for (const [name, nameCandidates] of sortedNames) {
    const checksums = new Set(nameCandidates.map((c) => c.checksum))

    if (checksums.size === 1) {
      // No conflict - all candidates are for the same checksum
      const checksum = nameCandidates[0].checksum
      takenNames.set(name, checksum)
      for (const c of nameCandidates) {
        addName(c.chainKey, checksum, name)
      }
    } else {
      // Conflict! Multiple checksums want this name
      resolveConflict(name, nameCandidates, takenNames, addName)
    }
  }

  // Step 4: Split into global vs byChain
  const global: Record<string, string[]> = {}
  const byChain: Record<string, Record<string, string[]>> = {}

  for (const [checksum, chains] of checksumChains) {
    // Collect names for this checksum from each chain that uses it
    const namesByChain: Array<[string, Set<string>]> = []
    for (const chainKey of chains) {
      const chainMap = resolved.get(chainKey)
      const names = chainMap?.get(checksum)
      if (names && names.size > 0) {
        namesByChain.push([chainKey, names])
      }
    }

    if (namesByChain.length === 0) continue

    // Check if all chains have exactly the same set of names
    const [, firstNames] = namesByChain[0]
    const allSame = namesByChain.every(
      ([, names]) =>
        names.size === firstNames.size &&
        [...names].every((n) => firstNames.has(n)),
    )

    if (allSame) {
      // All chains agree - goes to global
      global[checksum] = [...firstNames].sort()
    } else {
      // Chains disagree - goes to byChain
      for (const [chainKey, names] of namesByChain) {
        if (!byChain[chainKey]) {
          byChain[chainKey] = {}
        }
        byChain[chainKey][checksum] = [...names].sort()
      }
    }
  }

  return { global, byChain }
}

function resolveConflict(
  name: string,
  candidates: NameCandidate[],
  takenNames: Map<string, string>,
  addName: (chainKey: string, checksum: string, name: string) => void,
) {
  // Find max priority per checksum
  const checksumInfo = new Map<
    string,
    { maxPriority: number; candidates: NameCandidate[] }
  >()

  for (const c of candidates) {
    if (!checksumInfo.has(c.checksum)) {
      checksumInfo.set(c.checksum, { maxPriority: c.priority, candidates: [] })
    }
    const info = checksumInfo.get(c.checksum)!
    info.maxPriority = Math.max(info.maxPriority, c.priority)
    info.candidates.push(c)
  }

  const maxPriority = Math.max(
    ...[...checksumInfo.values()].map((i) => i.maxPriority),
  )
  const winners = [...checksumInfo.entries()].filter(
    ([, info]) => info.maxPriority === maxPriority,
  )

  if (winners.length === 1) {
    // Single winner gets the original name
    const [winnerChecksum, winnerInfo] = winners[0]
    takenNames.set(name, winnerChecksum)

    for (const c of winnerInfo.candidates) {
      addName(c.chainKey, winnerChecksum, name)
    }

    // Losers get alternative names
    for (const [checksum, info] of checksumInfo) {
      if (checksum === winnerChecksum) continue

      for (const c of info.candidates) {
        const altName = generateAlternativeName(c, name, takenNames)
        addName(c.chainKey, checksum, altName)
        takenNames.set(altName, checksum)
      }
    }
  } else {
    // Priority tie - all get alternative names
    for (const [checksum, info] of checksumInfo) {
      for (const c of info.candidates) {
        const altName = generateAlternativeName(c, name, takenNames)
        addName(c.chainKey, checksum, altName)
        takenNames.set(altName, checksum)
      }
    }
  }
}

function generateAlternativeName(
  candidate: NameCandidate,
  originalName: string,
  takenNames: Map<string, string>,
): string {
  const { chainKey, checksum, path } = candidate

  // Strategy 1: Add chain prefix (for cross-chain disambiguation)
  const chainPrefix = toPascalCase(chainKey)
  let altName = chainPrefix + originalName
  if (!takenNames.has(altName) || takenNames.get(altName) === checksum) {
    return altName
  }

  // Strategy 2: Use more path information if available
  if (path && path.length > 1) {
    // Try progressively longer path prefixes
    for (let i = path.length - 2; i >= 0; i--) {
      const pathPrefix = path.slice(i).map(toPascalCase).join("")
      if (
        !takenNames.has(pathPrefix) ||
        takenNames.get(pathPrefix) === checksum
      ) {
        return pathPrefix
      }
    }
  }

  // Strategy 3: Chain prefix + more path
  if (path && path.length > 1) {
    for (let i = path.length - 2; i >= 0; i--) {
      const pathPrefix = path.slice(i).map(toPascalCase).join("")
      altName = chainPrefix + pathPrefix
      if (!takenNames.has(altName) || takenNames.get(altName) === checksum) {
        return altName
      }
    }
  }

  // Strategy 4: Numeric suffix (last resort)
  let suffix = 2
  altName = originalName + suffix
  while (takenNames.has(altName) && takenNames.get(altName) !== checksum) {
    suffix++
    altName = originalName + suffix
  }

  return altName
}

function deriveNameFromPath(path: string[]): string {
  // Use just the last segment for brevity
  // e.g., ["xcm", "v3", "multiasset", "AssetId"] -> "AssetId"
  return toPascalCase(path[path.length - 1])
}

function toPascalCase(s: string): string {
  if (!s) return ""
  // Handle various cases: snake_case, camelCase, dots, etc.
  return s
    .split(/[_.\s]+/)
    .map((part) => {
      if (!part) return ""
      // Handle already PascalCase or camelCase
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join("")
}
