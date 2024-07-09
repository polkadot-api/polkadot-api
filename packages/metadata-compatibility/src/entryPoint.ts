import type { EnumVar } from "@polkadot-api/metadata-builders"
import {
  Codec,
  Struct,
  Vector,
  compact,
  type V14,
  type V15,
} from "@polkadot-api/substrate-bindings"
import type { TypedefNode } from "./typedef"
import {
  compareArrayLengths,
  CompatibilityLevel,
  isStaticCompatible,
  StaticCompatibleResult,
  strictMerge,
  unconditional,
} from "./isStaticCompatible"

export interface EntryPoint {
  args: number[]
  values: number[]
}
export const EntryPointCodec = Struct({
  args: Vector(compact),
  values: Vector(compact),
}) as Codec<EntryPoint>

export function storageEntryPoint(
  storageEntry: Exclude<
    (V15 | V14)["pallets"][number]["storage"],
    undefined
  >["items"][number],
): EntryPoint {
  if (storageEntry.type.tag === "plain")
    return {
      args: [],
      values: [storageEntry.type.value],
    }

  const { key, value } = storageEntry.type.value
  return {
    args: [key],
    values: [value],
  }
}

export function runtimeCallEntryPoint(
  entry: (V15 | V14)["apis"][number]["methods"][number],
): EntryPoint {
  return {
    args: entry.inputs.map((v) => v.type),
    values: [entry.output],
  }
}

export function enumValueEntryPoint(
  entry: EnumVar["value"][keyof EnumVar["value"]],
): EntryPoint {
  let values: number[]
  switch (entry.type) {
    case "array":
    case "lookupEntry":
      values = [entry.value.id]
      break
    case "struct":
    case "tuple":
      values = Object.values(entry.value).map((v) => v.id)
      break
    case "void":
      values = []
      break
  }
  return {
    args: [],
    values,
  }
}

export function entryPointsAreCompatible(
  descriptorEntry: EntryPoint | null,
  getDescriptorNode: (id: number) => TypedefNode | null,
  runtimeEntry: EntryPoint | null,
  getRuntimeNode: (id: number) => TypedefNode | null,
  cache: Map<TypedefNode, Map<TypedefNode, CompatibilityLevel | null>>,
): StaticCompatibleResult {
  if (runtimeEntry == null || descriptorEntry == null) {
    return unconditional(
      runtimeEntry == descriptorEntry
        ? CompatibilityLevel.Identical
        : runtimeEntry == null
          ? CompatibilityLevel.BackwardsCompatible
          : CompatibilityLevel.Incompatible,
    )
  }

  // EntryPoint interaction "origin -> dest" is descriptor -> runtime for args, and runtime -> descriptor for values.
  const argsLengthCheck = compareArrayLengths(
    descriptorEntry.args,
    runtimeEntry.args,
  )
  const valuesLengthCheck = compareArrayLengths(
    runtimeEntry.values,
    descriptorEntry.values,
  )

  return strictMerge([
    unconditional(argsLengthCheck),
    unconditional(valuesLengthCheck),
    ...runtimeEntry.args.map(
      (v, i) => () =>
        isStaticCompatible(
          getDescriptorNode(descriptorEntry.args[i]),
          getDescriptorNode,
          getRuntimeNode(v),
          getRuntimeNode,
          cache,
        ),
    ),
    ...descriptorEntry.values.map(
      (v, i) => () =>
        isStaticCompatible(
          getRuntimeNode(runtimeEntry.values[i]),
          getRuntimeNode,
          getDescriptorNode(v),
          getDescriptorNode,
          cache,
        ),
    ),
  ])
}
