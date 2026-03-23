import { expect, describe, it } from "vitest"
import { resolveTypeNames } from "@/type-names-claude"
import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import type { KnownTypes } from "@/known-types"

// Helper to create mock chain data
function createMockChain(
  key: string,
  types: Array<{ id: number; checksum: string; path: string[] }>,
  knownTypes: KnownTypes = {},
): {
  key: string
  lookup: MetadataLookup
  checksums: string[]
  knownTypes: KnownTypes
} {
  // Build checksums array (sparse, indexed by type id)
  const checksums: string[] = []
  const lookupEntries: Array<{ path: string[] }> = []

  for (const t of types) {
    checksums[t.id] = t.checksum
    lookupEntries[t.id] = { path: t.path }
  }

  // Create a minimal mock MetadataLookup
  const lookup = Object.assign(() => {}, {
    metadata: {
      lookup: lookupEntries,
    },
  }) as unknown as MetadataLookup

  return { key, lookup, checksums, knownTypes }
}

describe("resolveTypeNames", () => {
  describe("basic functionality", () => {
    it("returns empty results for empty input", () => {
      const result = resolveTypeNames([])
      expect(result).toEqual({ global: {}, byChain: {} })
    })

    it("derives name from path for single chain, single type", () => {
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "abc123", path: ["xcm", "v3", "AssetId"] },
      ])

      const result = resolveTypeNames([chain])

      expect(result.global["abc123"]).toEqual(["AssetId"])
      expect(result.byChain).toEqual({})
    })

    it("uses knownTypes name when available", () => {
      const chain = createMockChain(
        "polkadot",
        [{ id: 0, checksum: "abc123", path: ["some", "Path"] }],
        { abc123: { name: "MyKnownType", priority: 0 } },
      )

      const result = resolveTypeNames([chain])

      expect(result.global["abc123"]).toContain("MyKnownType")
    })

    it("includes both knownTypes name and path-derived name for same checksum", () => {
      const chain = createMockChain(
        "polkadot",
        [{ id: 0, checksum: "abc123", path: ["some", "DifferentName"] }],
        { abc123: { name: "MyKnownType", priority: 0 } },
      )

      const result = resolveTypeNames([chain])

      expect(result.global["abc123"]).toContain("MyKnownType")
      expect(result.global["abc123"]).toContain("DifferentName")
    })
  })

  describe("multiple names per checksum", () => {
    it("collects multiple path-derived names for same checksum", () => {
      // Same checksum at two different type IDs with different paths
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "abc123", path: ["pallet_a", "Pays"] },
        { id: 1, checksum: "abc123", path: ["pallet_b", "Voted"] },
      ])

      const result = resolveTypeNames([chain])

      expect(result.global["abc123"]).toContain("Pays")
      expect(result.global["abc123"]).toContain("Voted")
    })

    it("deduplicates same name from same path across type IDs", () => {
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "abc123", path: ["some", "Name"] },
        { id: 1, checksum: "abc123", path: ["some", "Name"] },
      ])

      const result = resolveTypeNames([chain])

      // Should only have one "Name", not duplicated
      expect(result.global["abc123"]).toEqual(["Name"])
    })
  })

  describe("conflict resolution with priorities", () => {
    it("higher priority wins the original name, lower priority gets alternative", () => {
      const chain = createMockChain(
        "polkadot",
        [
          { id: 0, checksum: "check1", path: ["a", "Event"] },
          { id: 1, checksum: "check2", path: ["b", "Event"] },
        ],
        {
          check1: { name: "Event", priority: 1 },
          check2: { name: "Event", priority: 0 },
        },
      )

      const result = resolveTypeNames([chain])

      // check1 has higher priority, gets "Event"
      expect(result.global["check1"]).toContain("Event")
      // check2 should get an alternative name (not "Event")
      expect(result.global["check2"]).toBeDefined()
      expect(result.global["check2"]).not.toContain("Event")
    })

    it("on priority tie, both checksums get alternative names", () => {
      const chain = createMockChain(
        "polkadot",
        [
          { id: 0, checksum: "check1", path: ["pallet_a", "Error"] },
          { id: 1, checksum: "check2", path: ["pallet_b", "Error"] },
        ],
        {
          check1: { name: "Error", priority: 0 },
          check2: { name: "Error", priority: 0 },
        },
      )

      const result = resolveTypeNames([chain])

      // Neither should have plain "Error" since it's a tie
      const names1 = result.global["check1"] || []
      const names2 = result.global["check2"] || []

      // At least one name per checksum
      expect(names1.length).toBeGreaterThan(0)
      expect(names2.length).toBeGreaterThan(0)

      // They should have different names
      const allNames1 = new Set(names1)
      const allNames2 = new Set(names2)
      const intersection = [...allNames1].filter((n) => allNames2.has(n))
      expect(intersection).toEqual([])
    })
  })

  describe("alternative name generation", () => {
    it("uses chain prefix for disambiguation", () => {
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "check1", path: ["a", "Location"] },
        { id: 1, checksum: "check2", path: ["b", "Location"] },
      ])

      const result = resolveTypeNames([chain])

      const allNames = [
        ...(result.global["check1"] || []),
        ...(result.global["check2"] || []),
      ]

      // One should have PolkadotLocation or similar chain-prefixed name
      expect(allNames.some((n) => n.includes("Polkadot"))).toBe(true)
    })

    it("uses path disambiguation when chain prefix conflicts", () => {
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "check1", path: ["xcm", "v2", "Response"] },
        { id: 1, checksum: "check2", path: ["xcm", "v3", "Response"] },
      ])

      const result = resolveTypeNames([chain])

      const names1 = result.global["check1"] || []
      const names2 = result.global["check2"] || []

      // Should use path to disambiguate (e.g., V2Response, V3Response or XcmV2Response, XcmV3Response)
      expect(names1.length).toBeGreaterThan(0)
      expect(names2.length).toBeGreaterThan(0)
      // Names should be different
      expect(names1).not.toEqual(names2)
    })

    it("falls back to numeric suffix as last resort", () => {
      // Create types with same name and no good disambiguation options
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "check1", path: ["Foo"] },
        { id: 1, checksum: "check2", path: ["Foo"] },
        { id: 2, checksum: "check3", path: ["Foo"] },
      ])

      const result = resolveTypeNames([chain])

      const allNames = [
        ...(result.global["check1"] || []),
        ...(result.global["check2"] || []),
        ...(result.global["check3"] || []),
      ]

      // Should have numeric suffixes like Foo2, Foo3
      expect(allNames.some((n) => /Foo\d+/.test(n))).toBe(true)
    })
  })

  describe("global vs byChain", () => {
    it("puts checksum in global when all chains agree on names", () => {
      const chain1 = createMockChain("polkadot", [
        { id: 0, checksum: "shared", path: ["common", "Type"] },
      ])
      const chain2 = createMockChain("kusama", [
        { id: 0, checksum: "shared", path: ["common", "Type"] },
      ])

      const result = resolveTypeNames([chain1, chain2])

      expect(result.global["shared"]).toEqual(["Type"])
      expect(result.byChain).toEqual({})
    })

    it("puts checksum in byChain when chains have different names", () => {
      const chain1 = createMockChain(
        "polkadot",
        [{ id: 0, checksum: "shared", path: ["a", "TypeA"] }],
        { shared: { name: "PolkadotName", priority: 0 } },
      )
      const chain2 = createMockChain(
        "kusama",
        [{ id: 0, checksum: "shared", path: ["b", "TypeB"] }],
        { shared: { name: "KusamaName", priority: 0 } },
      )

      const result = resolveTypeNames([chain1, chain2])

      // Should be in byChain, not global
      expect(result.global["shared"]).toBeUndefined()
      expect(result.byChain["polkadot"]?.["shared"]).toBeDefined()
      expect(result.byChain["kusama"]?.["shared"]).toBeDefined()

      // Each chain should have its own names
      expect(result.byChain["polkadot"]["shared"]).toContain("PolkadotName")
      expect(result.byChain["kusama"]["shared"]).toContain("KusamaName")
    })

    it("handles checksum used by only some chains", () => {
      const chain1 = createMockChain("polkadot", [
        { id: 0, checksum: "onlyPolkadot", path: ["specific", "Type"] },
      ])
      const chain2 = createMockChain("kusama", [
        { id: 0, checksum: "onlyKusama", path: ["other", "Type"] },
      ])

      const result = resolveTypeNames([chain1, chain2])

      // Each chain's unique checksum goes to global (since all chains using it agree)
      expect(result.global["onlyPolkadot"]).toBeDefined()
      expect(result.global["onlyKusama"]).toBeDefined()
    })
  })

  describe("cross-chain conflicts", () => {
    it("resolves same name wanted by different checksums on different chains", () => {
      const chain1 = createMockChain("polkadot", [
        { id: 0, checksum: "polkadotCheck", path: ["a", "Event"] },
      ])
      const chain2 = createMockChain("kusama", [
        { id: 0, checksum: "kusamaCheck", path: ["b", "Event"] },
      ])

      const result = resolveTypeNames([chain1, chain2])

      // Both checksums should have names (resolved somehow)
      const polkadotNames =
        result.global["polkadotCheck"] ||
        result.byChain["polkadot"]?.["polkadotCheck"] ||
        []
      const kusamaNames =
        result.global["kusamaCheck"] ||
        result.byChain["kusama"]?.["kusamaCheck"] ||
        []

      expect(polkadotNames.length).toBeGreaterThan(0)
      expect(kusamaNames.length).toBeGreaterThan(0)
    })

    it("uses priority across chains to determine winner", () => {
      const chain1 = createMockChain(
        "polkadot",
        [{ id: 0, checksum: "check1", path: ["a", "SharedName"] }],
        { check1: { name: "SharedName", priority: 5 } },
      )
      const chain2 = createMockChain(
        "kusama",
        [{ id: 0, checksum: "check2", path: ["b", "SharedName"] }],
        { check2: { name: "SharedName", priority: 1 } },
      )

      const result = resolveTypeNames([chain1, chain2])

      // check1 has higher priority, should get "SharedName"
      const check1Names =
        result.global["check1"] || result.byChain["polkadot"]?.["check1"] || []
      expect(check1Names).toContain("SharedName")

      // check2 should get alternative
      const check2Names =
        result.global["check2"] || result.byChain["kusama"]?.["check2"] || []
      expect(check2Names).not.toContain("SharedName")
    })
  })

  describe("edge cases", () => {
    it("handles empty path gracefully", () => {
      const chain = createMockChain("polkadot", [
        { id: 0, checksum: "noPath", path: [] },
      ])

      const result = resolveTypeNames([chain])

      // Type with empty path should not produce a name (unless known type)
      // The checksum might not appear in results at all
      expect(result.global["noPath"]).toBeUndefined()
    })

    it("handles types with only knownTypes name (no path)", () => {
      const chain = createMockChain(
        "polkadot",
        [{ id: 0, checksum: "knownOnly", path: [] }],
        { knownOnly: { name: "KnownOnlyType", priority: 0 } },
      )

      const result = resolveTypeNames([chain])

      expect(result.global["knownOnly"]).toContain("KnownOnlyType")
    })

    it("handles sparse checksums array", () => {
      const chain = createMockChain("polkadot", [
        // id 0, 1, 2 missing
        { id: 5, checksum: "atFive", path: ["some", "Type"] },
        // id 6, 7 missing
        { id: 10, checksum: "atTen", path: ["other", "Type"] },
      ])

      const result = resolveTypeNames([chain])

      expect(result.global["atFive"]).toBeDefined()
      expect(result.global["atTen"]).toBeDefined()
    })

    it("handles chain key with dots in name", () => {
      const chain = createMockChain("polkadot.assetHub", [
        { id: 0, checksum: "abc", path: ["some", "Type"] },
      ])

      const result = resolveTypeNames([chain])

      expect(result.global["abc"]).toBeDefined()
    })

    it("PascalCases chain keys for prefixes", () => {
      const chain1 = createMockChain("polkadot.assetHub", [
        { id: 0, checksum: "check1", path: ["a", "Name"] },
      ])
      const chain2 = createMockChain("kusama", [
        { id: 0, checksum: "check2", path: ["b", "Name"] },
      ])

      const result = resolveTypeNames([chain1, chain2])

      const allNames = [
        ...(result.global["check1"] || []),
        ...(result.global["check2"] || []),
        ...(result.byChain["polkadot.assetHub"]?.["check1"] || []),
        ...(result.byChain["kusama"]?.["check2"] || []),
      ]

      // Should have PascalCase chain prefix like "PolkadotAssetHubName"
      expect(
        allNames.some(
          (n) => n.includes("PolkadotAssetHub") || n.includes("Kusama"),
        ),
      ).toBe(true)
    })
  })
})
