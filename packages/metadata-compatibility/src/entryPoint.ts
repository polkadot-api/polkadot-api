import type { EnumVar } from "@polkadot-api/metadata-builders"
import {
  compactNumber,
  UnifiedMetadata,
  Struct,
  Variant,
} from "@polkadot-api/substrate-bindings"
import { isCompatible } from "./isCompatible"
import { CompatibilityCache, isStaticCompatible } from "./isStaticCompatible"
import {
  mapLookupToTypedef,
  mapReferences,
  Primitive,
  TypedefCodec,
  type TypedefNode,
} from "./typedef"

export type EntryPointNode =
  | {
      type: "lookup"
      value: number
    }
  | {
      type: "typedef"
      value: TypedefNode
    }
const EntryPointNodeCodec = Variant({
  lookup: compactNumber,
  typedef: TypedefCodec,
})

const lookupNode = (value: number): EntryPointNode => ({
  type: "lookup",
  value,
})
const typedefNode = (value: TypedefNode): EntryPointNode => ({
  type: "typedef",
  value,
})
export const voidEntryPointNode = typedefNode({
  type: "terminal",
  value: { type: Primitive.void },
})

export interface EntryPoint {
  args: EntryPointNode
  values: EntryPointNode
}
export const EntryPointCodec = Struct({
  args: EntryPointNodeCodec,
  values: EntryPointNodeCodec,
})

export function storageEntryPoint(
  storageEntry: Exclude<
    UnifiedMetadata["pallets"][number]["storage"],
    undefined
  >["items"][number],
): EntryPoint {
  if (storageEntry.type.tag === "plain")
    return {
      args: voidEntryPointNode,
      values: lookupNode(storageEntry.type.value),
    }

  const { key, value } = storageEntry.type.value
  return {
    args: lookupNode(key),
    values: lookupNode(value),
  }
}

export function runtimeCallEntryPoint(
  entry: UnifiedMetadata["apis"][number]["methods"][number],
): EntryPoint {
  return {
    args: typedefNode({
      type: "tuple",
      value: entry.inputs.map((v) => v.type),
    }),
    values: lookupNode(entry.output),
  }
}

export function enumValueEntryPointNode(
  entry: EnumVar["value"][keyof EnumVar["value"]],
): EntryPointNode {
  return entry.type === "lookupEntry"
    ? lookupNode(entry.value.id)
    : typedefNode(mapLookupToTypedef(entry))
}

export function singleValueEntryPoint(value: number): EntryPoint {
  return {
    args: voidEntryPointNode,
    values: lookupNode(value),
  }
}

export function entryPointsAreCompatible(
  descriptorEntry: EntryPoint,
  getDescriptorNode: (id: number) => TypedefNode,
  runtimeEntry: EntryPoint,
  getRuntimeNode: (id: number) => TypedefNode,
  cache: CompatibilityCache,
) {
  const resolveNode = (
    node: EntryPointNode,
    getTypedef: (id: number) => TypedefNode,
  ): TypedefNode =>
    node.type === "lookup" ? getTypedef(node.value) : node.value

  // EntryPoint interaction "origin -> dest" is descriptor -> runtime for args, and runtime -> descriptor for values.
  return {
    args: isStaticCompatible(
      resolveNode(descriptorEntry.args, getDescriptorNode),
      getDescriptorNode,
      resolveNode(runtimeEntry.args, getRuntimeNode),
      getRuntimeNode,
      cache,
    ).level,
    values: isStaticCompatible(
      resolveNode(runtimeEntry.values, getRuntimeNode),
      getRuntimeNode,
      resolveNode(descriptorEntry.values, getDescriptorNode),
      getDescriptorNode,
      cache,
    ).level,
  }
}

export function valueIsCompatibleWithDest(
  dest: EntryPointNode,
  getDestNode: (id: number) => TypedefNode,
  value: unknown,
) {
  const node = dest.type === "lookup" ? getDestNode(dest.value) : dest.value
  return isCompatible(value, node, getDestNode)
}

export function mapEntryPointReferences(
  entryPoint: EntryPoint,
  mapFn: (id: number) => number,
): EntryPoint {
  const mapNode = (node: EntryPointNode) =>
    node.type === "lookup"
      ? lookupNode(mapFn(node.value))
      : typedefNode(mapReferences(node.value, mapFn))

  return {
    args: mapNode(entryPoint.args),
    values: mapNode(entryPoint.values),
  }
}
