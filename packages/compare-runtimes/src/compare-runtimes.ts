import {
  CompatibilityLevel,
  entryPointsAreCompatible,
  enumValueEntryPointNode,
  mapLookupToTypedef,
  runtimeCallEntryPoint,
  singleValueEntryPoint,
  storageEntryPoint,
  TypedefNode,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"
import { EnumEntry, getMappedMetadata } from "./mapped-metadata"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { ComparedChange, Output } from "./public-types"
import { shallowDiff } from "./shallow-diff"

const getEnumEntry = (entry: EnumEntry, side: "args" | "values") => {
  const node = enumValueEntryPointNode(entry)
  return {
    args: side === "args" ? node : voidEntryPointNode,
    values: side === "args" ? voidEntryPointNode : node,
  }
}

const getMetadataHelpers = (rawMetadata: Uint8Array) => {
  const metadata = unifyMetadata(decAnyMetadata(rawMetadata))
  const lookupFn = getLookupFn(metadata)
  const typeNodesCache: (TypedefNode | null)[] = []
  const compat = new Map()
  const getTypeDefNode = (id: number) =>
    (typeNodesCache[id] ||= mapLookupToTypedef(lookupFn(id)))
  const metadataMaps = getMappedMetadata(metadata, lookupFn)

  return { lookupFn, compat, getTypeDefNode, metadataMaps }
}

const minCompatLevel = (levels: {
  args: CompatibilityLevel
  values: CompatibilityLevel
}) => Math.min(levels.args, levels.values)

export const compareRuntimes = (
  prevMetadata: Uint8Array,
  nextMetadata: Uint8Array,
): Output => {
  const [prev, next] = [prevMetadata, nextMetadata].map(getMetadataHelpers)

  const cache = new Map()
  const compareEnumEntries = ({
    kind,
    pallet,
    name,
  }: {
    kind: "call" | "event" | "error"
    pallet: string
    name: string
  }): ComparedChange => {
    const a = prev.metadataMaps.pallets[pallet]![kind].get(name)!
    const b = next.metadataMaps.pallets[pallet]![kind].get(name)!
    const argsOrValues = kind === "call" ? "args" : "values"

    return {
      kind,
      pallet,
      name,
      compat: minCompatLevel(
        entryPointsAreCompatible(
          getEnumEntry(a, argsOrValues),
          prev.getTypeDefNode,
          getEnumEntry(b, argsOrValues),
          next.getTypeDefNode,
          cache,
        ),
      ),
    }
  }

  const compareConst = (pallet: string, name: string): ComparedChange => {
    const a = prev.metadataMaps.pallets[pallet]!.const.get(name)!
    const b = next.metadataMaps.pallets[pallet]!.const.get(name)!

    return {
      kind: "const",
      pallet,
      name,
      compat: minCompatLevel(
        entryPointsAreCompatible(
          singleValueEntryPoint(a.type),
          prev.getTypeDefNode,
          singleValueEntryPoint(b.type),
          next.getTypeDefNode,
          cache,
        ),
      ),
    }
  }

  const compareStg = (pallet: string, name: string): ComparedChange => {
    const a = prev.metadataMaps.pallets[pallet]!.stg.get(name)!
    const b = next.metadataMaps.pallets[pallet]!.stg.get(name)!

    return {
      kind: "stg",
      pallet,
      name,
      compat: entryPointsAreCompatible(
        storageEntryPoint(a),
        prev.getTypeDefNode,
        storageEntryPoint(b),
        next.getTypeDefNode,
        cache,
      ),
    }
  }

  const compareViewFn = (pallet: string, name: string): ComparedChange => {
    const a = prev.metadataMaps.pallets[pallet]!.view.get(name)!
    const b = next.metadataMaps.pallets[pallet]!.view.get(name)!

    return {
      kind: "view",
      pallet,
      name,
      compat: entryPointsAreCompatible(
        runtimeCallEntryPoint(a),
        prev.getTypeDefNode,
        runtimeCallEntryPoint(b),
        next.getTypeDefNode,
        cache,
      ),
    }
  }

  const compareRuntimeApi = (group: string, name: string): ComparedChange => {
    const a = prev.metadataMaps.api[group]!.get(name)!
    const b = next.metadataMaps.api[group]!.get(name)!

    return {
      kind: "api",
      group,
      name,
      compat: entryPointsAreCompatible(
        runtimeCallEntryPoint(a),
        prev.getTypeDefNode,
        runtimeCallEntryPoint(b),
        next.getTypeDefNode,
        cache,
      ),
    }
  }

  const added = shallowDiff(prev.metadataMaps, next.metadataMaps, "added")
  const removed = shallowDiff(next.metadataMaps, prev.metadataMaps, "added")
  const commonApis = shallowDiff(prev.metadataMaps, next.metadataMaps, "kept")

  const kept = commonApis.map((x) => {
    switch (x.kind) {
      case "const":
        return compareConst(x.pallet, x.name)
      case "stg":
        return compareStg(x.pallet, x.name)
      case "view":
        return compareViewFn(x.pallet, x.name)
      case "api":
        return compareRuntimeApi(x.group, x.name)
      default:
        return compareEnumEntries(x as any)
    }
  })

  return { added, removed, kept }
}
