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

type Graph = Map<number, [LookupEntry, Set<number>]>
const buildGraph = (entry: LookupEntry, result: Graph = new Map()) => {
  if (result.has(entry.id)) return result

  switch (entry.type) {
    case "array":
    case "option":
    case "sequence":
      result.set(entry.id, [entry, new Set([entry.value.id])])
      buildGraph(entry.value, result)
      break
    case "enum": {
      const children = Object.values(entry.value).flatMap((value) => {
        if (value.type === "void") return []
        if (value.type === "lookupEntry") return value.value
        if (value.type === "struct") return Object.values(value.value)
        return value.value
      })
      result.set(entry.id, [entry, new Set(children.map((child) => child.id))])
      children.forEach((child) => buildGraph(child, result))
      break
    }
    case "result":
      result.set(entry.id, [
        entry,
        new Set([entry.value.ok.id, entry.value.ko.id]),
      ])
      buildGraph(entry.value.ok, result)
      buildGraph(entry.value.ko, result)
      break
    case "struct": {
      const children = Object.values(entry.value)
      result.set(entry.id, [entry, new Set(children.map((child) => child.id))])
      children.forEach((child) => buildGraph(child, result))
      break
    }
    case "tuple":
      result.set(entry.id, [
        entry,
        new Set(entry.value.map((child) => child.id)),
      ])
      entry.value.forEach((child) => buildGraph(child, result))
      break
    default:
      result.set(entry.id, [entry, new Set()])
  }
  return result
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
    return getChecksum([shapeIds.primitive, runtimePrimitiveIds.accountId])
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
    const innerChecksum = buildNextChecksum(innerValue)

    return getChecksum([shapeIds.vector, innerChecksum, BigInt(input.len)])
  }

  if (input.type === "sequence") {
    const innerValue = input.value
    if (innerValue.type === "primitive" && innerValue.value === "u8") {
      return getChecksum([shapeIds.primitive, runtimePrimitiveIds.byteSequence])
    }
    const innerChecksum = buildNextChecksum(innerValue)

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
    if (entry.type === "lookupEntry") return buildNextChecksum(entry.value)
    switch (entry.type) {
      case "void":
        return getChecksum([shapeIds.void])
      case "tuple":
        return buildTuple(entry.value)
      case "struct":
        return buildStruct(entry.value)
    }
  })
}

const getCycles = (graph: Graph) => {
  // Tarjan's strongly connected components
  const tarjanState = new Map<
    number,
    {
      index: number
      lowLink: number
      onStack: boolean
    }
  >()
  let index = 0
  const stack: number[] = []
  const result: Array<Set<number>> = []

  function strongConnect(v: number): void {
    const state = {
      index: index,
      lowLink: index,
      onStack: true,
    }
    tarjanState.set(v, state)
    index++
    stack.push(v)

    const edges = graph.get(v)![1]
    for (let w of edges) {
      const edgeState = tarjanState.get(w)
      if (!edgeState) {
        strongConnect(w)
        state.lowLink = Math.min(state.lowLink, tarjanState.get(w)!.lowLink)
      } else if (edgeState.onStack) {
        state.lowLink = Math.min(state.lowLink, edgeState.index)
      }
    }

    if (state.lowLink === state.index) {
      const component = new Set<number>()

      let poppedNode = -1
      do {
        poppedNode = stack.pop()!
        tarjanState.get(poppedNode)!.onStack = false
        component.add(poppedNode)
      } while (poppedNode !== v)

      if (component.size > 1) result.push(component)
    }
  }

  for (const node of graph.keys()) {
    if (!tarjanState.has(node)) {
      strongConnect(node)
    }
  }

  return result
}

const getCyclicGroups = (cycles: Array<Set<number>>) => {
  const ungroupedCycles = new Set(cycles.map((_, i) => i))
  const edges = new Map(cycles.map((_, i) => [i, new Set<number>()]))
  cycles.forEach((cycle, i) => {
    cycles.slice(i + 1).forEach((otherCycle, _j) => {
      const j = _j + i + 1
      const combined = new Set([...cycle, ...otherCycle])
      if (combined.size !== cycle.size + otherCycle.size) {
        edges.get(i)!.add(j)
        edges.get(j)!.add(i)
      }
    })
  })
  const groups: Array<Set<number>> = []

  while (ungroupedCycles.size) {
    const group = new Set<number>()
    const toVisit = [ungroupedCycles.values().next().value]
    while (toVisit.length) {
      const idx = toVisit.pop()
      if (!ungroupedCycles.has(idx)) continue
      ungroupedCycles.delete(idx)

      const cycle = cycles[idx]
      cycle.forEach((v) => group.add(Number(v)))
      edges.get(idx)!.forEach((n) => toVisit.push(n))
    }
    groups.push(group)
  }

  return groups
}

const sortCyclicGroups = (groups: Array<Set<number>>, graph: Graph) => {
  const getReachableNodes = (group: Set<number>) => {
    const first = group.values().next().value as number
    const entry = graph.get(first)![0]
    return Array.from(buildGraph(entry).keys())
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

const buildChecksum = (entry: LookupEntry, cache: Map<number, bigint>) => {
  if (cache.has(entry.id)) return cache.get(entry.id)!

  const graph = buildGraph(entry)
  const cycles = getCycles(graph)
  const cyclicGroups = getCyclicGroups(cycles)
  const sortedCyclicGroups = sortCyclicGroups(cyclicGroups, graph)

  // separate writeCache since we might want to not override the current cache to ensure deterministic result regardless of order
  const recursiveBuildChecksum = (
    entry: LookupEntry,
    writeCache: (id: number, value: bigint) => void,
    skipCache = false,
  ): bigint => {
    if (!skipCache && cache.has(entry.id)) {
      return cache.get(entry.id)!
    }
    const result = _buildChecksum(entry, (nextEntry) =>
      recursiveBuildChecksum(nextEntry, writeCache),
    )
    writeCache(entry.id, result)
    return result
  }

  sortedCyclicGroups.forEach((group) => {
    group.forEach((id) => cache.set(id, 0n))
    for (let i = 0; i < group.size; i++) {
      const results = new Map<number, bigint>()
      group.forEach((id) =>
        recursiveBuildChecksum(
          graph.get(id)![0],
          (id, value) => {
            // only store onto the actual cache results from other nodes
            // cyclic nodes would depend on sorting order.
            const writeCache = group.has(id) ? results : cache
            writeCache.set(id, value)
          },
          true,
        ),
      )
      Array.from(results.entries()).forEach(([id, checksum]) =>
        cache.set(id, checksum),
      )
    }
  })

  return recursiveBuildChecksum(entry, (id, value) => cache.set(id, value))
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
    if (input.type === "void") return getChecksum([0n])

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
