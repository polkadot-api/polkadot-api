import type { StringRecord, V15 } from "@polkadot-api/substrate-bindings"
import { h64 } from "@polkadot-api/substrate-bindings"
import { analyzeGraph } from "graph-cycles"
import {
  LookupEntry,
  MetadataPrimitives,
  StructVar,
  TupleVar,
  VoidVar,
  getLookupFn,
} from "./lookups"

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

const buildGraph = (
  entry: LookupEntry,
  result = new Map<number, [LookupEntry, number[]]>(),
) => {
  if (result.has(entry.id)) return result

  switch (entry.type) {
    case "array":
    case "option":
    case "sequence":
      result.set(entry.id, [entry, [entry.value.id]])
      buildGraph(entry.value, result)
      break
    case "enum": {
      const children = Object.values(entry.value).flatMap((value) => {
        if (value.type === "primitive") return []
        if (value.type === "struct") return Object.values(value.value)
        return value.value
      })
      result.set(entry.id, [entry, children.map((child) => child.id)])
      children.forEach((child) => buildGraph(child, result))
      break
    }
    case "result":
      result.set(entry.id, [entry, [entry.value.ok.id, entry.value.ko.id]])
      buildGraph(entry.value.ok, result)
      buildGraph(entry.value.ko, result)
      break
    case "struct": {
      const children = Object.values(entry.value)
      result.set(entry.id, [entry, children.map((child) => child.id)])
      children.forEach((child) => buildGraph(child, result))
      break
    }
    case "tuple":
      result.set(entry.id, [entry, entry.value.map((child) => child.id)])
      entry.value.forEach((child) => buildGraph(child, result))
      break
    default:
      result.set(entry.id, [entry, []])
  }
  return result
}

const _buildChecksum = (
  input: LookupEntry,
  buildNextChecksum: (entry: LookupEntry) => bigint,
): bigint => {
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

const buildChecksum = (entry: LookupEntry, cache: Map<number, bigint>) => {
  if (cache.has(entry.id)) return cache.get(entry.id)!

  const graph = buildGraph(entry)
  const result = analyzeGraph(
    Array.from(graph.entries()).map(([from, [, edges]]) => [
      String(from),
      edges.map((v) => String(v)),
    ]),
  )

  /**
   * We can't have "entryPoint" nodes as if they are part of the cycle, because it breaks the deterministic property.
   * Picture this: a <-> b <- c
   * If we start from either a or b, we won't see c as it's not in the cycle, so we will consider `a <-> b`
   * Then we solve the checksums A, B.
   * If we get a request for checksum C, then we will see the graph `c -> b <-> a`. But B is already solved so we will do C(B)
   *
   * Now if we get a different ordering, starting from c, we see the graph `c -> b <-> a`.
   * If we try to solve hashes A B and C simultaneously, it could happen that on the first iteration C is equal to either B or A. This will cause
   * a new round of re-generating checksums until all of them are distinct.
   * The result of this is that A and B will have a different checksum than the previous ordering.
   *
   * The solution is to exclude the entry points from the cycle. With the example (c -> a <-> b -> d), the order to calculate checksums is:
   * 1. Dependencies (d)
   * 2. Cycles (a and b)
   * 3. Entry points (c)
   */
  const entryPoints = new Set(result.entrypoints.flat().map((id) => Number(id)))
  const circularIds = new Set(
    result.all.map((id) => Number(id)).filter((id) => !entryPoints.has(id)),
  )
  const nonCircularIds = Array.from(graph.keys()).filter(
    (id) => !circularIds.has(id) && !entryPoints.has(id),
  )
  const newCircularIds = Array.from(circularIds).filter((id) => !cache.has(id))

  // separate writeCache since we might want to not override the current cache to ensure deterministic result regardless of order
  const recursiveBuildChecksum = (
    entry: LookupEntry,
    writeCache: Map<number, bigint>,
    skipCache = false,
  ): bigint => {
    if (!skipCache && cache.has(entry.id)) {
      return cache.get(entry.id)!
    }
    const result = _buildChecksum(entry, (nextEntry) =>
      recursiveBuildChecksum(nextEntry, writeCache),
    )
    writeCache.set(entry.id, result)
    return result
  }

  nonCircularIds.forEach((id) =>
    recursiveBuildChecksum(graph.get(id)![0], cache),
  )

  newCircularIds.forEach((id) => {
    cache.set(id, 0n)
  })
  const hasDuplicates = () => {
    const checksums = newCircularIds.map((id) => cache.get(id)!)
    return checksums.length != new Set(checksums).size
  }
  for (
    let i = 0;
    i < newCircularIds.length && (i === 0 || hasDuplicates());
    i++
  ) {
    const results = new Map<number, bigint>()
    newCircularIds.forEach((id) =>
      recursiveBuildChecksum(graph.get(id)![0], results, true),
    )
    Array.from(results.entries()).forEach(([id, checksum]) =>
      cache.set(id, checksum),
    )
  }

  return recursiveBuildChecksum(entry, cache)
}

export const getChecksumBuilder = (metadata: V15) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const cache = new Map<number, bigint>()

  const buildDefinition = (id: number): bigint =>
    buildChecksum(getLookupEntryDef(id), cache)

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
