import {
  getChecksumBuilder,
  LookupEntry,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  EntryPoint,
  enumValueEntryPointNode,
  mapEntryPointReferences,
  runtimeCallEntryPoint,
  singleValueEntryPoint,
  storageEntryPoint,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"

/**
 * This function extracts from `metadata` all the types used from any entry
 * point (pallets and runtime APIs)
 * pruning and de-duplicating repeated types.
 *
 * It returns a map of `checksum => TypedefNode` for compatibility checking and
 * an array of checksums to map the dependencies of those `TypdefNode` (which
 * are expressed as indices) to the next checksum.
 * (Which will be needed when merging types from multiple chains)
 */
export const getUsedTypes = (
  lookup: MetadataLookup,
  builder: ReturnType<typeof getChecksumBuilder>,
) => {
  const visited = new Set<string>()
  const types = new Map<string, LookupEntry>()

  const addTypeFromLookup = (id: number | undefined) => {
    if (id == null) return
    const checksum = builder.buildDefinition(id)
    if (!checksum) {
      throw new Error("Unreachable: checksum not available for lookup type")
    }
    // We can't use `types` directly, because mapLookupToTypedef can recursively call this function.
    if (visited.has(checksum)) return
    visited.add(checksum)
    types.set(checksum, lookup(id))
  }
  const addTypeFromEntryPoint = (entry: EntryPoint) => {
    mapEntryPointReferences(entry, (id) => {
      addTypeFromLookup(id)
      return id
    })
  }

  const buildEnum = (side: "args" | "values", val: number | undefined) => {
    if (val === undefined) return
    const entry = lookup(val)

    if (entry.type === "void") return
    if (entry.type !== "enum") throw new Error("Expected enum")

    Object.values(entry.value).forEach((value) => {
      const node = enumValueEntryPointNode(value)
      addTypeFromEntryPoint({
        args: side === "args" ? node : voidEntryPointNode,
        values: side === "args" ? voidEntryPointNode : node,
      })
    })
  }

  lookup.metadata.pallets.forEach((pallet) => {
    pallet.storage?.items.forEach((entry) => {
      addTypeFromEntryPoint(storageEntryPoint(entry))
    })
    pallet.constants.forEach(({ type }) => {
      addTypeFromEntryPoint(singleValueEntryPoint(type))
    })
    pallet.viewFns.forEach((entry) => {
      addTypeFromEntryPoint(runtimeCallEntryPoint(entry))
    })
    buildEnum("args", pallet.calls?.type)
    buildEnum("values", pallet.events?.type)
    buildEnum("values", pallet.errors?.type)
  })

  lookup.metadata.apis.forEach((api) =>
    api.methods.forEach((method) => {
      addTypeFromEntryPoint(runtimeCallEntryPoint(method))
    }),
  )

  return { types }
}
