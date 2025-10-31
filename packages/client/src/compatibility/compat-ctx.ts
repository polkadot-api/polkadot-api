import { ChainDefinition } from "@/descriptors"
import {
  EntryPoint,
  EntryPointCodec,
  enumValueEntryPointNode,
  isCompatible,
  mapLookupToTypedef,
  runtimeCallEntryPoint,
  singleValueEntryPoint,
  storageEntryPoint,
  TypedefCodec,
  TypedefNode,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"
import { Tuple, Vector } from "@polkadot-api/substrate-bindings"
import { RuntimeContext, type EnumEntry } from "@polkadot-api/observable-client"
import { withWeakCache } from "@/utils/with-weak-cache"

const EntryPointsCodec = Vector(EntryPointCodec)
const TypedefsCodec = Vector(TypedefCodec)
const [, typesDec] = Tuple(EntryPointsCodec, TypedefsCodec)

export const enum OpType {
  Storage = "storage",
  Tx = "tx",
  Event = "events",
  Const = "constants",
  ViewFns = "viewFns",
  Api = "apis",
}

export interface CompatCtx {
  getTypeDefNode: (id: number) => TypedefNode
  getEntryPointNode: (
    type: OpType,
    group: string,
    name: string,
  ) => EntryPoint | undefined
}

export const getUserCompatCtx = async ({
  metadataTypes,
  descriptors: awaitedDescriptors,
}: ChainDefinition): Promise<CompatCtx> => {
  const [[entryPoints, typeDefNodes], descriptors] = await Promise.all([
    metadataTypes.then(typesDec),
    awaitedDescriptors,
  ])

  return {
    getTypeDefNode: (id) => typeDefNodes[id],
    getEntryPointNode: (type, group, name) => {
      const idx = descriptors[type]?.[group]?.[name]
      return idx == null ? idx : entryPoints[idx]
    },
  }
}

const getEnumEntry = (entry: EnumEntry, side: "args" | "values") => {
  const node = enumValueEntryPointNode(entry)
  const [args, values] =
    side === "args" ? [node, voidEntryPointNode] : [voidEntryPointNode, node]
  return { args, values }
}

export const getDestCompatCtx = withWeakCache(
  ({
    lookup,
    assetId,
    mappedMeta: { pallets, api },
  }: RuntimeContext): CompatCtx & {
    isAssetCompat: (asset: any) => boolean
  } => {
    const typeNodesCache = new Map<number, TypedefNode>()
    const getTypeDefNode = (id: number) => {
      let result = typeNodesCache.get(id)
      if (result) return result
      typeNodesCache.set(id, (result = mapLookupToTypedef(lookup(id))))
      return result
    }

    return {
      getTypeDefNode,
      getEntryPointNode: (type, group, name) => {
        switch (type) {
          case OpType.Storage: {
            const entry = pallets[group]?.storage.get(name)
            return entry && storageEntryPoint(entry)
          }
          case OpType.Tx: {
            const entry = pallets[group]?.call.get(name)
            return entry && getEnumEntry(entry, "args")
          }
          case OpType.Event: {
            const entry = pallets[group]?.event.get(name)
            return entry && getEnumEntry(entry, "values")
          }
          case OpType.ViewFns: {
            const entry = pallets[group]?.view.get(name)
            return entry && runtimeCallEntryPoint(entry)
          }
          case OpType.Api: {
            const entry = api[group]?.get(name)
            return entry && runtimeCallEntryPoint(entry)
          }
          case OpType.Const: {
            const entry = pallets[group]?.const.get(name)
            return entry && singleValueEntryPoint(entry.type)
          }
        }
      },
      isAssetCompat: (asset) =>
        assetId == null ||
        isCompatible(asset, getTypeDefNode(assetId), getTypeDefNode),
    }
  },
)

export const getEntryAndGetter = <T extends CompatCtx | null>(
  compatCtx: T,
  type: OpType,
  group: string,
  name: string,
): null extends T
  ? null
  : {
      entry?: EntryPoint
      getter: (id: number) => TypedefNode
    } => {
  if (!compatCtx) return null as any
  const { getEntryPointNode, getTypeDefNode: getter } = compatCtx
  return {
    entry: getEntryPointNode(type, group, name),
    getter,
  } as any
}
