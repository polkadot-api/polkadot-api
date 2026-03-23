# Codegen Package - Agent Guide

This document provides context for AI agents working on the `@polkadot-api/codegen` package.

## Package Overview

This package generates TypeScript type definitions and descriptors from Substrate chain metadata. It's used to create strongly-typed APIs for interacting with Polkadot SDK-based chains.

## Key Concepts

### Checksums

A **checksum** is a hash that uniquely identifies a type's structure (not its name or path). Two types with identical structure but different names/paths will have the same checksum. Checksums are computed by `@polkadot-api/metadata-builders` using the `getChecksumBuilder` function.

Checksums are base-32 encoded strings like `"abc123def"`.

### MetadataLookup

`MetadataLookup` is a function that retrieves type information by ID from chain metadata:

```typescript
interface MetadataLookup {
  (id: number): LookupEntry // Get type by ID
  metadata: UnifiedMetadata // Access to full metadata
  call: number | null // ID of the Call type
}
```

The `metadata.lookup` array contains type definitions with:

- `path`: Array of strings representing the type's location (e.g., `["xcm", "v3", "AssetId"]`)
- `params`: Generic type parameters
- `def`: The type definition (enum, struct, primitive, etc.)
- `docs`: Documentation strings

### KnownTypes

`KnownTypes` is a mapping from checksum to a pre-defined name with priority:

```typescript
type KnownTypes = Record<
  string,
  {
    name: string
    priority: number // Higher = wins conflicts, default 0
  }
>
```

Known types are defined in `src/known-types.ts` and represent types that should have specific, stable names across chains.

### Chain Data Structure

When working with multiple chains, each chain provides:

```typescript
{
  key: string              // Chain identifier (e.g., "polkadot", "kusama", "polkadot.assetHub")
  lookup: MetadataLookup   // Access to chain's metadata
  checksums: string[]      // Sparse array: checksums[typeId] = checksum or undefined
  knownTypes: KnownTypes   // Chain-specific known type overrides
}
```

The `checksums` array is indexed by type ID. Empty positions mean that type is not used by the chain.

## Type Names Resolution (`src/type-names-claude.ts`)

### Purpose

Resolves human-readable names for types across multiple chains, handling:

- Name conflicts between different types wanting the same name
- Multiple names per type (from different paths or known types)
- Splitting results into global (shared) vs chain-specific names

### Algorithm

1. **Collect candidates**: For each chain and checksum, gather name candidates from:
   - `knownTypes` (with their priorities)
   - Metadata paths (multiple type IDs can have same checksum but different paths)

2. **Detect conflicts**: Group candidates by name. Multiple checksums wanting the same name = conflict.

3. **Resolve conflicts** based on priority:
   - Single highest priority wins the original name
   - On tie, all get alternative names
   - Alternative strategies (in order):
     1. Chain prefix (e.g., `PolkadotAssetId`)
     2. More path segments (e.g., `V3AssetId`, `MultiassetAssetId`)
     3. Chain prefix + path
     4. Numeric suffix (last resort: `Name2`, `Name3`)

4. **Split into global vs byChain**:
   - If all chains using a checksum have identical name sets → `global`
   - Otherwise → `byChain`

### Return Type

```typescript
{
  global: Record<string, string[]> // checksum -> names (same across all chains)
  byChain: Record<string, Record<string, string[]>> // chainKey -> checksum -> names
}
```

A checksum maps to an array of names because the same type can have multiple valid names (e.g., both "Pays" and "Voted" for an `Enum<Yes | No>` type).

## Types Builder (`src/types-builder.ts`)

Generates TypeScript type definitions from metadata. Key functions:

- `buildTypeDefinition(id)`: Generate TS type for a lookup ID
- `buildStorage(pallet, entry)`: Generate storage query types
- `buildEvent/buildError/buildCall(pallet, name)`: Generate variant types
- `buildRuntimeCall(api, method)`: Generate runtime API types
- `buildConstant(pallet, name)`: Generate constant types

## Testing

Tests use `vitest`. Example test setup:

```typescript
import { expect, describe, it, beforeAll } from "vitest"
import {
  getLookupFn,
  getChecksumBuilder,
} from "@polkadot-api/metadata-builders"
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings"

let lookup: MetadataLookup

beforeAll(async () => {
  const metadataRaw = await fs.readFile("./tests/ksm.bin")
  lookup = getLookupFn(unifyMetadata(metadataCodec.dec(metadataRaw)))
})
```

For unit tests with mock data:

```typescript
function createMockChain(key, types, knownTypes = {}) {
  const checksums = []
  const lookupEntries = []

  for (const t of types) {
    checksums[t.id] = t.checksum
    lookupEntries[t.id] = { path: t.path }
  }

  const lookup = Object.assign(() => {}, {
    metadata: { lookup: lookupEntries },
  }) as unknown as MetadataLookup

  return { key, lookup, checksums, knownTypes }
}
```

Run tests: `npx vitest run tests/type-names.spec.ts`

## File Structure

```
src/
├── known-types.ts          # Pre-defined type names with checksums
├── type-names-claude.ts    # Multi-chain type name resolution
├── type-names.ts           # (Alternative implementation, incomplete)
├── types-builder.ts        # TypeScript code generation
├── get-new-types.ts        # Discovers unnamed types needing names
├── internal-types/         # Internal type representation
└── generate-*.ts           # Various descriptor generators

tests/
├── ksm.bin                 # Kusama metadata binary for testing
├── types-builder.spec.ts   # Types builder tests
└── type-names.spec.ts      # Type names resolution tests
```

## Common Patterns

### Iterating Over Pallets

```typescript
lookup.metadata.pallets.forEach((pallet) => {
  pallet.storage?.items.forEach(({ name }) => /* ... */)
  pallet.constants.forEach(({ name }) => /* ... */)

  // For calls/events/errors (they're enums)
  if (pallet.calls) {
    const entry = lookup.metadata.lookup[pallet.calls.type]
    if (entry.def.tag === "variant") {
      entry.def.value.forEach(({ name }) => /* ... */)
    }
  }
})
```

### Getting Type Path

```typescript
const typeId = 42
const entry = lookup.metadata.lookup[typeId]
const path = entry.path // e.g., ["xcm", "v3", "AssetId"]
const name = path[path.length - 1] // "AssetId"
```

### Converting to PascalCase

```typescript
function toPascalCase(s: string): string {
  return s
    .split(/[_.\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
```

## Important Notes

- Always prefer short names but avoid conflicts
- Priority in knownTypes determines conflict winners (higher wins)
- Chain keys can contain dots (e.g., "polkadot.assetHub") - handle in PascalCase conversion
- Empty checksums array positions mean unused types - skip them
- Same checksum can appear at multiple type IDs with different paths
- The `@/` import alias resolves to `src/`
