import type { Codec, StringRecord, V14 } from "@capi-dev/substrate-bindings"
import type { LookupEntry } from "./lookups"
import { getLookupFn } from "./lookups"
import * as scale from "@capi-dev/substrate-bindings"

const _bytes = scale.Bytes()

const _buildCodec = (
  input: LookupEntry,
  stack: Set<LookupEntry>,
  circularCodecs: Map<LookupEntry, Codec<any>>,
): Codec<any> => {
  if (input.type === "primitive") return scale[input.value]
  if (input.type === "compact") return scale.compact
  if (input.type === "bitSequence") return scale.bitSequence

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return _bytes
  }

  const buildNextCodec = (nextInput: LookupEntry): Codec<any> => {
    if (!stack.has(nextInput)) {
      const nextStack = new Set(stack)
      nextStack.add(input)
      const result = _buildCodec(nextInput, nextStack, circularCodecs)
      if (circularCodecs.has(input)) circularCodecs.set(input, result)
      return result
    }

    circularCodecs.set(input, scale._void)

    return scale.Self(() => circularCodecs.get(input)!)
  }

  const buildVector = (inner: LookupEntry, len?: number) => {
    const innerCodec = buildNextCodec(inner)
    return len ? scale.Vector(innerCodec, len) : scale.Vector(innerCodec)
  }

  const buildTuple = (value: LookupEntry[]) =>
    scale.Tuple(...value.map(buildNextCodec))

  const buildStruct = (value: StringRecord<LookupEntry>) => {
    const inner = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, buildNextCodec(value)]),
    ) as StringRecord<Codec<any>>
    return scale.Struct(inner)
  }

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8")
      return scale.Bytes(input.len)

    return buildVector(input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(input.value)
  if (input.type === "tuple") return buildTuple(input.value)
  if (input.type === "struct") return buildStruct(input.value)

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((v) => {
    if (v.type === "primitive") return scale._void
    return v.type === "tuple" ? buildTuple(v.value) : buildStruct(v.value)
  })

  const inner = Object.fromEntries(
    Object.keys(input.value).map((key, idx) => {
      return [key, dependencies[idx]]
    }),
  ) as StringRecord<Codec<any>>

  const indexes = Object.values(input.value).map((x) => x.idx)
  const areIndexesSorted = indexes.every((idx, i) => idx === i)

  return areIndexesSorted
    ? scale.Enum(inner)
    : scale.Enum(inner, indexes as any)
}

const emptyTuple = scale.Tuple()

export const getDynamicBuilder = (metadata: V14) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const buildDefinition = (id: number): Codec<any> =>
    _buildCodec(getLookupEntryDef(id), new Set(), new Map())

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        key: emptyTuple,
        val: buildDefinition(storageEntry.type.value),
      }

    const { key, value } = storageEntry.type.value
    const val = buildDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? scale.Tuple(buildDefinition(key))
        : buildDefinition(key)

    return { key: returnKey, val }
  }

  const buildCall = (
    pallet: string,
    callName: string,
  ): {
    location: [number, number]
    args: Codec<any>
  } => {
    const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
    const callsLookup = getLookupEntryDef(palletEntry.calls! as number)

    if (callsLookup.type !== "enum") throw null
    const callEntry = callsLookup.value[callName]
    return {
      location: [palletEntry.index, callEntry.idx],
      args:
        callEntry.type === "primitive"
          ? emptyTuple
          : scale.Tuple(
              ...Object.values(callEntry.value).map((l) =>
                buildDefinition(l.id),
              ),
            ),
    }
  }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildDefinition(storageEntry.type as number)
  }

  return { buildDefinition, buildStorage, buildCall, buildConstant }
}
