import type { StringRecord, V14, V15 } from "@polkadot-api/substrate-bindings"
import { h64 } from "@polkadot-api/substrate-bindings"
import {
  ArrayVar,
  LookupEntry,
  MetadataPrimitives,
  StructVar,
  TupleVar,
  VoidVar,
  getLookupFn,
} from "./lookups"
import {
  LookupGraph,
  buildLookupGraph,
  getStronglyConnectedComponents,
  getSubgraph,
  mergeSCCsWithCommonNodes,
} from "./lookup-graph"

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
  | "void"
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
  void: 7n,
}

type RuntimePrimitives =
  | "undefined"
  | "number"
  | "string"
  | "bigint"
  | "boolean"
  | "bitSequence"
  | "byteSequence"
  | "accountId32"
  | "accountId20"

const runtimePrimitiveIds: Record<RuntimePrimitives, bigint> = {
  undefined: 0n,
  number: 1n,
  string: 2n,
  bigint: 3n,
  boolean: 4n,
  bitSequence: 5n, // {bitsLen: number, bytes: Uint8Array}
  byteSequence: 6n, // Binary
  accountId32: 7n, // SS58String
  accountId20: 8n, // EthAccount
}

const metadataPrimitiveIds: Record<MetadataPrimitives, bigint> = {
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
  buildNextChecksum: (entry: LookupEntry) => bigint,
): bigint => {
  if (input.type === "primitive")
    return getChecksum([shapeIds.primitive, metadataPrimitiveIds[input.value]])

  if (input.type === "void") return getChecksum([shapeIds.void])

  if (input.type === "compact")
    return getChecksum([
      shapeIds.primitive,
      runtimePrimitiveIds[
        input.isBig || input.isBig === null ? "bigint" : "number"
      ],
    ])

  if (input.type === "bitSequence")
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.bitSequence])

  if (input.type === "AccountId32") {
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.accountId32])
  }

  if (input.type === "AccountId20") {
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.accountId20])
  }

  const buildVector = (entry: LookupEntry, length?: number) => {
    const innerChecksum = buildNextChecksum(entry)
    return getChecksum(
      length !== undefined
        ? [shapeIds.vector, innerChecksum, BigInt(length)]
        : [shapeIds.vector, innerChecksum],
    )
  }

  if (input.type === "array") {
    const innerValue = input.value
    if (innerValue.type === "primitive" && innerValue.value === "u8") {
      return getChecksum([
        shapeIds.primitive,
        runtimePrimitiveIds.byteSequence,
        BigInt(input.len),
      ])
    }
    return buildVector(innerValue, input.len)
  }

  if (input.type === "sequence") {
    const innerValue = input.value
    if (innerValue.type === "primitive" && innerValue.value === "u8") {
      return getChecksum([shapeIds.primitive, runtimePrimitiveIds.byteSequence])
    }
    return buildVector(innerValue)
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
    if (entry.type === "lookupEntry") return buildNextChecksum(entry.value)
    switch (entry.type) {
      case "void":
        return getChecksum([shapeIds.void])
      case "tuple":
        return buildTuple(entry.value)
      case "struct":
        return buildStruct(entry.value)
      case "array":
        return buildVector(entry.value, entry.len)
    }
  })
}

const sortCyclicGroups = (groups: Array<Set<number>>, graph: LookupGraph) => {
  const getReachableNodes = (group: Set<number>) => {
    const result = new Set<number>()
    const toVisit = Array.from(group)
    while (toVisit.length) {
      const id = toVisit.pop()!
      if (result.has(id)) continue
      result.add(id)

      graph.get(id)?.refs.forEach((id) => toVisit.push(id))
    }

    return Array.from(result)
  }

  const result: Array<Set<number>> = new Array()

  function dependentsFirst(group: Set<number>) {
    if (result.includes(group)) return
    const dependents = groups.filter(
      (candidate) =>
        candidate !== group &&
        getReachableNodes(group).some((node) => candidate.has(node)),
    )
    dependents.forEach((group) => dependentsFirst(group))
    if (result.includes(group)) return
    result.push(group)
  }

  groups.forEach((group) => dependentsFirst(group))
  return result
}

function iterateChecksums(
  group: Set<number>,
  iterations: number,
  cache: Map<number, bigint>,
  graph: LookupGraph,
) {
  // Keep the values that are getting changed on each iteration in a separate
  // cache, because two nodes referencing the same one should read the same
  // previous iteration checksum for that node.
  const groupReadCache = new Map([...group].map((id) => [id, 0n]))
  const groupWriteCache = new Map<number, bigint>()

  const recursiveBuildChecksum = (
    entry: LookupEntry,
    // The first call has to skip the cache, otherwise it would return the
    // previous iteration result.
    skipCache = true,
  ): bigint => {
    if (!skipCache && (groupReadCache.has(entry.id) || cache.has(entry.id))) {
      return groupReadCache.get(entry.id) ?? cache.get(entry.id)!
    }
    const result = _buildChecksum(entry, (nextEntry) =>
      recursiveBuildChecksum(nextEntry, false),
    )
    if (group.has(entry.id)) {
      groupWriteCache.set(entry.id, result)
    } else {
      cache.set(entry.id, result)
    }
    return result
  }

  for (let i = 0; i < iterations; i++) {
    group.forEach((id) => recursiveBuildChecksum(graph.get(id)!.entry))

    group.forEach((id) => groupReadCache.set(id, groupWriteCache.get(id)!))
  }

  return groupReadCache
}

function getMirroredNodes(
  cyclicGroups: Array<Set<number>>,
  graph: LookupGraph,
) {
  const maxSize = cyclicGroups.reduce(
    (acc, group) => Math.max(acc, group.size),
    0,
  )
  const allEntries = new Set([...graph.values()].map((v) => v.entry.id))

  const resultingChecksums = iterateChecksums(
    allEntries,
    maxSize,
    // Cache won't be used, since it's using the internal one for every node.
    new Map(),
    graph,
  )

  const checksumToNodes = new Map<bigint, number[]>()
  for (const id of allEntries) {
    const checksum = resultingChecksums.get(id)
    if (checksum == undefined) throw new Error("Unreachable")
    if (!checksumToNodes.has(checksum)) {
      checksumToNodes.set(checksum, [])
    }
    checksumToNodes.get(checksum)!.push(id)
  }

  const checksumsWithDuplicates = [...checksumToNodes.entries()].filter(
    ([, nodes]) => nodes.length > 1,
  )

  const duplicatesMap: Record<number, number[]> = {}
  checksumsWithDuplicates.forEach(([, nodes]) => {
    nodes.forEach((n) => (duplicatesMap[n] = nodes))
  })

  return duplicatesMap
}

const buildChecksum = (
  entry: LookupEntry,
  cache: Map<number, bigint>,
  graph: LookupGraph,
) => {
  if (cache.has(entry.id)) return cache.get(entry.id)!

  const subGraph = getSubgraph(entry.id, graph)

  const cycles = getStronglyConnectedComponents(subGraph)
  const cyclicGroups = mergeSCCsWithCommonNodes(cycles).filter((group) => {
    // Exclude groups that were previously calculated
    return !cache.has(group.values().next().value)
  })
  const mirrored = getMirroredNodes(cyclicGroups, subGraph)
  const sortedCyclicGroups = sortCyclicGroups(
    cyclicGroups.filter((group) => group.size > 1),
    subGraph,
  )

  sortedCyclicGroups.forEach((group) => {
    if (cache.has(group.values().next().value)) {
      // exclude mirrored groups
      return
    }

    const result = iterateChecksums(group, group.size, cache, graph)
    group.forEach((id) => {
      const checksum = result.get(id)!
      if (id in mirrored) {
        mirrored[id].forEach((id) => cache.set(id, checksum))
      } else {
        cache.set(id, checksum)
      }
    })
  })

  const getChecksum = (entry: LookupEntry) => {
    if (cache.has(entry.id)) return cache.get(entry.id)!
    return _buildChecksum(entry, getChecksum)
  }

  return getChecksum(entry)
}

export const getChecksumBuilder = (
  metadata: V14 | V15,
  getLookupEntryDef = getLookupFn(metadata.lookup),
) => {
  const graph = buildLookupGraph(getLookupEntryDef, metadata.lookup.length)

  const cache = new Map<number, bigint>()

  const buildDefinition = (id: number): bigint =>
    buildChecksum(getLookupEntryDef(id), cache, graph)

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

  const buildComposite = (
    input: TupleVar | StructVar | VoidVar | ArrayVar,
  ): bigint => {
    if (input.type === "void") return getChecksum([0n])

    if (input.type === "tuple") {
      const values = Object.values(input.value).map((entry) =>
        buildDefinition(entry.id),
      )

      return getChecksum([shapeIds.tuple, ...values])
    }

    if (input.type === "array") {
      return getChecksum([
        shapeIds.vector,
        buildDefinition(input.value.id),
        BigInt(input.len),
      ])
    }

    // Otherwise struct
    return structLikeBuilder(shapeIds.struct, input.value, (entry) =>
      buildDefinition(entry.id),
    )
  }

  const buildNamedTuple = (input: StructVar): bigint => {
    return structLikeBuilder(shapeIds.tuple, input.value, (entry) =>
      buildDefinition(entry.id),
    )
  }

  const buildVariant =
    (variantType: "errors" | "events" | "calls") =>
    (pallet: string, name: string): bigint | null => {
      try {
        const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
        const enumLookup = getLookupEntryDef(
          palletEntry[variantType]! as number,
        )
        buildDefinition(enumLookup.id)

        if (enumLookup.type !== "enum") throw null
        const entry = enumLookup.value[name]
        return entry.type === "lookupEntry"
          ? buildDefinition(entry.value.id)
          : buildComposite(entry)
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
    buildNamedTuple: toStringEnhancer(buildNamedTuple),
    getAllGeneratedChecksums: () =>
      Array.from(cache.values()).map((v) => v.toString(32)),
  }
}
