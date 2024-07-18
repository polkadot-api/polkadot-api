import {
  getChecksumBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import {
  EntryPoint,
  TypedefNode,
  mapLookupToTypedef,
  runtimeCallEntryPoint,
  storageEntryPoint,
  enumValueEntryPointNode,
  singleValueEntryPoint,
  voidEntryPointNode,
  mapEntryPointReferences,
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
  const checksums: string[] = new Array(lookup.metadata.lookup.length)
  const visited = new Set<string>()
  const types = new Map<string, TypedefNode>()
  const entryPoints = new Map<string, EntryPoint>()

  const addTypeFromLookup = (id: number | undefined) => {
    if (id == null) return
    const checksum = builder.buildDefinition(id)
    if (!checksum) {
      throw new Error("Unreachable: checksum not available for lookup type")
    }
    checksums[id] = checksum
    // We can't use `types` directly, because mapLookupToTypedef can recursively call this function.
    if (visited.has(checksum)) return
    visited.add(checksum)
    types.set(checksum, mapLookupToTypedef(lookup(id), addTypeFromLookup))
  }
  const addTypeFromEntryPoint = (checksum: string, entry: EntryPoint) => {
    entryPoints.set(checksum, entry)
    mapEntryPointReferences(entry, (id) => {
      addTypeFromLookup(id)
      return id
    })
  }

  const buildEnum = (
    side: "args" | "values",
    val: number | undefined,
    cb: (name: string) => string,
  ) => {
    if (val === undefined) return
    const entry = lookup(val)

    if (entry.type === "void") return
    if (entry.type !== "enum") throw new Error("Expected enum")

    Object.entries(entry.value).forEach(([name, value]) => {
      const checksum = cb(name)
      const node = enumValueEntryPointNode(value)
      addTypeFromEntryPoint(checksum, {
        args: side === "args" ? node : voidEntryPointNode,
        values: side === "args" ? voidEntryPointNode : node,
      })
    })
  }

  lookup.metadata.pallets.forEach((pallet) => {
    pallet.storage?.items.forEach((entry) => {
      const checksum = builder.buildStorage(pallet.name, entry.name)!
      addTypeFromEntryPoint(checksum, storageEntryPoint(entry))
    })
    pallet.constants.forEach(({ name, type }) => {
      const checksum = builder.buildConstant(pallet.name, name)!
      addTypeFromEntryPoint(checksum, singleValueEntryPoint(type))
    })
    buildEnum(
      "args",
      pallet.calls,
      (name) => builder.buildCall(pallet.name, name)!,
    )
    buildEnum(
      "values",
      pallet.events,
      (name) => builder.buildEvent(pallet.name, name)!,
    )
    buildEnum(
      "values",
      pallet.errors,
      (name) => builder.buildError(pallet.name, name)!,
    )
  })

  lookup.metadata.apis.forEach((api) =>
    api.methods.forEach((method) => {
      const checksum = builder.buildRuntimeCall(api.name, method.name)!
      addTypeFromEntryPoint(checksum, runtimeCallEntryPoint(method))
    }),
  )

  return { types, entryPoints, checksums }
}
