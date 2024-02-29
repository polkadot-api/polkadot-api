import type { StringRecord, V15 } from "@polkadot-api/substrate-bindings"
import { h64 } from "@polkadot-api/substrate-bindings"
import {
  LookupEntry,
  MetadataPrimitives,
  StructVar,
  TupleVar,
  VoidVar,
  getLookupFn,
} from "./lookups"
import { withCache } from "./with-cache"

const textEncoder = new TextEncoder()
const encodeText = textEncoder.encode.bind(textEncoder)

const getChecksum = (values: Array<bigint>) => {
  const res = new Uint8Array(values.length * 8)
  const dv = new DataView(res.buffer)

  for (let i = 0; i < values.length; i++) dv.setBigUint64(i * 8, values[i])

  return h64(res)
}
const getStringChecksum = (values: Array<string>) =>
  getChecksum(values.map((v) => h64(encodeText(v))))

type Shape =
  | "primitive"
  | "vector"
  | "tuple"
  | "struct"
  | "option"
  | "result"
  | "enum"
const shapeIds: Record<Shape, bigint> = {
  primitive: 0n,
  vector: 1n,
  tuple: 2n,
  struct: 3n,
  option: 4n,
  result: 5n,
  enum: 6n,
}

type RuntimePrimitives =
  | "undefined"
  | "number"
  | "string"
  | "bigint"
  | "boolean"
  | "bitSequence"
  | "byteSequence"
  | "accountId"

const runtimePrimitiveIds: Record<RuntimePrimitives, bigint> = {
  undefined: 0n,
  number: 1n,
  string: 2n,
  bigint: 3n,
  boolean: 4n,
  bitSequence: 5n, // {bitsLen: number, bytes: Uint8Array}
  byteSequence: 6n, // Binary
  accountId: 7n, // SS58String
}

const metadataPrimitiveIds: Record<MetadataPrimitives | "_void", bigint> = {
  _void: runtimePrimitiveIds.undefined,
  bool: runtimePrimitiveIds.boolean,
  char: runtimePrimitiveIds.string,
  str: runtimePrimitiveIds.string,
  u8: runtimePrimitiveIds.number,
  u16: runtimePrimitiveIds.number,
  u32: runtimePrimitiveIds.number,
  u64: runtimePrimitiveIds.bigint,
  u128: runtimePrimitiveIds.bigint,
  u256: runtimePrimitiveIds.bigint,
  i8: runtimePrimitiveIds.number,
  i16: runtimePrimitiveIds.number,
  i32: runtimePrimitiveIds.number,
  i64: runtimePrimitiveIds.bigint,
  i128: runtimePrimitiveIds.bigint,
  i256: runtimePrimitiveIds.bigint,
}

const structLikeBuilder = <T>(
  shapeId: bigint,
  input: StringRecord<T>,
  innerChecksum: (value: T) => bigint,
) => {
  const sortedEntries = Object.entries(input).sort(([a], [b]) =>
    a.localeCompare(b),
  )
  const keysChecksum = getStringChecksum(sortedEntries.map(([key]) => key))
  const valuesChecksum = getChecksum(
    sortedEntries.map(([, entry]) => innerChecksum(entry)),
  )

  return getChecksum([shapeId, keysChecksum, valuesChecksum])
}

const _buildChecksum = (
  input: LookupEntry,
  cache: Map<number, bigint>,
  stack: Set<number>,
): bigint => {
  if (cache.has(input.id)) return cache.get(input.id)!

  if (input.type === "primitive")
    return getChecksum([shapeIds.primitive, metadataPrimitiveIds[input.value]])

  if (input.type === "compact")
    return getChecksum([
      shapeIds.primitive,
      runtimePrimitiveIds[input.isBig ? "bigint" : "number"],
    ])

  if (input.type === "bitSequence")
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.bitSequence])

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.byteSequence])
  }

  if (input.type === "AccountId32") {
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.accountId])
  }

  const buildNextChecksum = (nextInput: LookupEntry): bigint =>
    buildChecksum(nextInput, cache, stack)

  if (input.type === "array") {
    const innerChecksum = buildNextChecksum(input.value)
    return getChecksum([shapeIds.vector, innerChecksum, BigInt(input.len)])
  }

  if (input.type === "sequence") {
    const innerChecksum = buildNextChecksum(input.value)
    return getChecksum([shapeIds.vector, innerChecksum])
  }

  const buildTuple = (entries: LookupEntry[]) =>
    getChecksum([shapeIds.tuple, ...entries.map(buildNextChecksum)])

  const buildStruct = (entries: StringRecord<LookupEntry>) =>
    structLikeBuilder(shapeIds.struct, entries, buildNextChecksum)

  if (input.type === "tuple") return buildTuple(input.value)

  if (input.type === "struct") return buildStruct(input.value)

  if (input.type === "option")
    return getChecksum([shapeIds.option, buildNextChecksum(input.value)])

  if (input.type === "result")
    return getChecksum([
      shapeIds.result,
      buildNextChecksum(input.value.ok),
      buildNextChecksum(input.value.ko),
    ])

  return structLikeBuilder(shapeIds.enum, input.value, (entry) => {
    switch (entry.type) {
      case "primitive":
        return metadataPrimitiveIds._void
      case "tuple":
        return buildTuple(entry.value)
      case "struct":
        return buildStruct(entry.value)
    }
  })
}
const buildChecksum = withCache(
  _buildChecksum,
  () => 0n,
  (result) => result,
)

export const getChecksumBuilder = (metadata: V15) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const cache = new Map<number, bigint>()

  const buildDefinition = (id: number): bigint =>
    buildChecksum(getLookupEntryDef(id), cache, new Set())

  const buildStorage = (pallet: string, entry: string): bigint | null => {
    try {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .storage!.items.find((s) => s.name === entry)!

      if (storageEntry.type.tag === "plain")
        return buildDefinition(storageEntry.type.value)

      const { key, value } = storageEntry.type.value
      const val = buildDefinition(value)
      const returnKey = buildDefinition(key)
      return getChecksum([val, returnKey])
    } catch (_) {
      return null
    }
  }

  const buildRuntimeCall = (api: string, method: string): bigint | null => {
    try {
      const entry = metadata.apis
        .find((x) => x.name === api)
        ?.methods.find((x) => x.name === method)
      if (!entry) throw null

      const argNamesChecksum = getStringChecksum(
        entry.inputs.map((x) => x.name),
      )
      const argValuesChecksum = getChecksum(
        entry.inputs.map((x) => buildDefinition(x.type)),
      )
      const outputChecksum = buildDefinition(entry.output)

      return getChecksum([argNamesChecksum, argValuesChecksum, outputChecksum])
    } catch (_) {
      return null
    }
  }

  const buildComposite = (input: TupleVar | StructVar | VoidVar): bigint => {
    if (input.type === "primitive") return getChecksum([0n])

    if (input.type === "tuple") {
      const values = Object.values(input.value).map((entry) =>
        buildDefinition(entry.id),
      )

      return getChecksum([shapeIds.tuple, ...values])
    }

    // Otherwise struct
    return structLikeBuilder(shapeIds.struct, input.value, (entry) =>
      buildDefinition(entry.id),
    )
  }

  const buildVariant =
    (variantType: "errors" | "events" | "calls") =>
    (pallet: string, name: string): bigint | null => {
      try {
        const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
        const callsLookup = getLookupEntryDef(
          palletEntry[variantType]! as number,
        )

        if (callsLookup.type !== "enum") throw null
        return buildComposite(callsLookup.value[name])
      } catch (_) {
        return null
      }
    }

  const buildConstant = (
    pallet: string,
    constantName: string,
  ): bigint | null => {
    try {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .constants!.find((s) => s.name === constantName)!

      return buildDefinition(storageEntry.type)
    } catch (_) {
      return null
    }
  }

  const toStringEnhancer =
    <Args extends Array<any>>(
      fn: (...args: Args) => bigint | null,
    ): ((...args: Args) => string | null) =>
    (...args) =>
      fn(...args)?.toString(32) ?? null

  return {
    buildDefinition: toStringEnhancer(buildDefinition),
    buildRuntimeCall: toStringEnhancer(buildRuntimeCall),
    buildStorage: toStringEnhancer(buildStorage),
    buildCall: toStringEnhancer(buildVariant("calls")),
    buildEvent: toStringEnhancer(buildVariant("events")),
    buildError: toStringEnhancer(buildVariant("errors")),
    buildConstant: toStringEnhancer(buildConstant),
    buildComposite: toStringEnhancer(buildComposite),
  }
}
