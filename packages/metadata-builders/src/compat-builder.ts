import { Binary } from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { MetadataPrimitives, Var } from "./lookups"

interface StructNode {
  type: "struct"
  values: {
    [key: string]: number
  }
}
interface TerminalNode {
  type: "terminal"
  value:
    | "bool"
    | "string"
    | "number"
    | "bigint"
    | "numeric"
    | "bitseq"
    | "binary"
}
interface EnumNode {
  type: "enum"
  variants: {
    [key: string]: TypedefNode | null
  }
}
interface TupleNode {
  type: "tuple"
  values: number[]
}
interface ArrayNode {
  type: "array"
  value: number
  length?: number
}
interface OptionNode {
  type: "option"
  value: number
}
interface ResultNode {
  type: "result"
  ok: number
  ko: number
}

type TypedefNode =
  | StructNode
  | TerminalNode
  | EnumNode
  | TupleNode
  | ArrayNode
  | OptionNode
  | ResultNode

const primitiveToTerminal: Record<MetadataPrimitives, TerminalNode["value"]> = {
  i256: "bigint",
  i128: "bigint",
  i64: "bigint",
  i32: "number",
  i16: "number",
  i8: "number",
  u256: "bigint",
  u128: "bigint",
  u64: "bigint",
  u32: "number",
  u16: "number",
  u8: "number",
  bool: "bool",
  char: "string",
  str: "string",
}

export function mapLookupToTypedef(
  entry: Var,
  resolve: (id: number) => void = () => {},
): TypedefNode | null {
  switch (entry.type) {
    case "AccountId20":
    case "AccountId32":
      return {
        type: "terminal",
        value: "string",
      }
    case "array":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return {
          type: "terminal",
          value: "binary",
        }
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: entry.value.id,
        length: entry.len,
      }
    case "bitSequence":
      return {
        type: "terminal",
        value: "bitseq",
      }
    case "compact":
      return {
        type: "terminal",
        value:
          entry.isBig === null ? "numeric" : entry.isBig ? "bigint" : "number",
      }
    case "enum":
      return {
        type: "enum",
        variants: mapObject(entry.value, (params) =>
          params.type === "lookupEntry"
            ? mapLookupToTypedef(params.value, resolve)
            : mapLookupToTypedef(params, resolve),
        ),
      }
    case "struct": {
      const values = mapObject(entry.value, (prop) => prop.id)
      Object.values(values).forEach(resolve)
      return {
        type: "struct",
        values,
      }
    }
    case "tuple": {
      const values = entry.value.map((v) => v.id)
      values.forEach(resolve)
      return {
        type: "tuple",
        values,
      }
    }
    case "option":
      resolve(entry.value.id)
      return {
        type: "option",
        value: entry.value.id,
      }
    case "primitive":
      return {
        type: "terminal",
        value: primitiveToTerminal[entry.value],
      }
    case "result":
      resolve(entry.value.ok.id)
      resolve(entry.value.ko.id)
      return {
        type: "result",
        ok: entry.value.ok.id,
        ko: entry.value.ko.id,
      }
    case "sequence":
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return {
          type: "terminal",
          value: "binary",
        }
      }
      resolve(entry.value.id)
      return {
        type: "array",
        value: entry.value.id,
      }
    case "void":
      return null
  }
}

// Descriptors: pallet + name => index (this._descriptors[opType][pallet][name])
// index will be for both checksums and compatLookup

// Dest type: describes types of the receiving end.
export function isCompatible(
  value: any,
  destNode: TypedefNode | null,
  getNode: (id: number) => TypedefNode | null,
): boolean {
  // A void node is always compatible
  if (!destNode) return true

  // Is this ok? This will cover for structs with optional keys
  if (destNode.type === "option" && value == undefined) {
    return true
  }

  const nextCall = (value: any, destNode: TypedefNode | null) =>
    isCompatible(value, destNode, getNode)

  const checkTerminal = (terminal: TerminalNode) => {
    switch (terminal.value) {
      case "string":
        return typeof value === "string"
      case "bigint":
        return typeof value === "bigint"
      case "bitseq":
        return (
          typeof value === "object" &&
          value != null &&
          typeof value.bitsLen === "number" &&
          value.bytes instanceof Uint8Array
        )
      case "bool":
        return typeof value === "boolean"
      case "number":
        return typeof value === "number"
      case "numeric":
        return typeof value === "number" || typeof value === "bigint"
      case "binary":
        // TODO
        return value instanceof Uint8Array || value instanceof Binary
    }
  }

  switch (destNode.type) {
    case "terminal":
      return checkTerminal(destNode)
    case "array":
      const valueArr = value as Array<any>
      // TODO check passing an array with greater length sends in truncated to destNode.length
      if (destNode.length !== undefined && valueArr.length < destNode.length) {
        return false
      }
      return valueArr
        .slice(0, destNode.length)
        .every((value) => nextCall(value, getNode(destNode.value)))
    case "enum":
      const valueEnum = value as { type: string; value: any }
      if (!(valueEnum.type in destNode.variants)) {
        return false
      }
      const variantValue = destNode.variants[valueEnum.type]
      if (variantValue === null) {
        return true
      }
      return nextCall(valueEnum.value, variantValue)
    case "option":
      if (value == undefined) {
        return true
      }
      return nextCall(value, getNode(destNode.value))
    case "struct":
      return Object.keys(destNode.values).every((key) =>
        nextCall(value[key], getNode(destNode.values[key])),
      )
    case "tuple":
      // length will be checked indirectly
      return destNode.values.every((idx) =>
        nextCall(value[idx], getNode(destNode.values[idx])),
      )
    case "result":
      if (!("success" in value && "value" in value)) return false
      return nextCall(
        value.value,
        getNode(value.success ? destNode.ok : destNode.ko),
      )
  }
}

export type StaticCompatibleResult = boolean | "partially"
export function isStaticCompatible(
  originNode: TypedefNode | null,
  getOriginNode: (id: number) => TypedefNode | null,
  destNode: TypedefNode | null,
  getDestNode: (id: number) => TypedefNode | null,
  cache: Map<TypedefNode, Map<TypedefNode, StaticCompatibleResult>>,
): StaticCompatibleResult {
  if (destNode && originNode) {
    if (!cache.has(destNode)) {
      cache.set(destNode, new Map())
    }
    const destNodeCache = cache.get(destNode)!
    if (destNodeCache.has(originNode)) {
      return destNodeCache.get(originNode)!
    }
    destNodeCache.set(originNode, "partially")
  }

  const result = getIsStaticCompatible(
    originNode,
    destNode,
    (originNode, destNode) =>
      isStaticCompatible(
        typeof originNode === "number" ? getOriginNode(originNode) : originNode,
        getOriginNode,
        typeof destNode === "number" ? getDestNode(destNode) : destNode,
        getDestNode,
        cache,
      ),
  )

  if (destNode && originNode) {
    cache.get(destNode)!.set(originNode, result)
  }
  return result
}

function getIsStaticCompatible(
  originNode: TypedefNode | null,
  destNode: TypedefNode | null,
  nextCall: (
    originNode: TypedefNode | number | null,
    destNode: TypedefNode | number | null,
  ) => StaticCompatibleResult,
): StaticCompatibleResult {
  // A void node is always compatible, as the origin won't be read.
  if (!destNode) return true

  if (originNode?.type !== destNode.type) {
    if (destNode.type === "option") {
      return nextCall(originNode, destNode.value)
    }
    if (originNode?.type === "option") {
      return nextCall(originNode.value, destNode) ? "partially" : false
    }
    return false
  }

  // Putting it below here in case destNode is optional => in that case, we can omit this branch
  // but at this point we have to have a value.
  if (!originNode) return false

  switch (destNode.type) {
    case "terminal":
      return destNode.value === (originNode as TerminalNode).value
    case "array":
      const arrayOrigin = originNode as ArrayNode
      const lengthCheck: StaticCompatibleResult =
        destNode.length === undefined
          ? true
          : arrayOrigin.length === undefined
            ? "partially"
            : arrayOrigin.length >= destNode.length
      return strictMerge([
        () => lengthCheck,
        () => nextCall(arrayOrigin.value, destNode.value),
      ])
    case "enum":
      const enumOrigin = originNode as EnumNode
      // check whether every possible `origin` value is compatible with dest
      return mergeResults(
        Object.entries(enumOrigin.variants).map(
          ([type, value]) =>
            () =>
              type in destNode.variants
                ? nextCall(value, destNode.variants[type])
                : false,
        ),
      )
    case "option":
      return nextCall((originNode as OptionNode).value, destNode.value)
    case "struct":
      const structOrigin = originNode as StructNode
      return strictMerge(
        Object.entries(destNode.values).map(
          ([key, value]) =>
            () =>
              nextCall(structOrigin.values[key], value),
        ),
      )
    case "tuple":
      const tupleOrigin = originNode as TupleNode
      return strictMerge([
        destNode.values.length <= tupleOrigin.values.length,
        ...destNode.values.map(
          (value, idx) => () => nextCall(tupleOrigin.values[idx], value),
        ),
      ])
    case "result":
      const resultOrigin = originNode as ResultNode
      return mergeResults([
        nextCall(resultOrigin.ok, destNode.ok),
        nextCall(resultOrigin.ko, destNode.ko),
      ])
  }
}

/**
 * Merges multiple results, following the most "strict" one, (semantically an
 * AND)
 * If one of them is `false`, returns `false`.
 * Else if one of them is `partially`, returns `partially`.
 * Else returns `true`
 */
const strictMerge = (
  results: Array<StaticCompatibleResult | (() => StaticCompatibleResult)>,
): StaticCompatibleResult => {
  let isPartially = false

  for (const resultFn of results) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    if (!result) return false
    isPartially ||= result === "partially"
  }

  return isPartially ? "partially" : false
}

/**
 * Merges multiple results, going to `partially` (semantically an OR)
 * If all of them are `false`, returns `false`
 * If all of them are `true`, returns `true`
 * Else returns `partially`
 */
const mergeResults = (
  results: Array<StaticCompatibleResult | (() => StaticCompatibleResult)>,
): StaticCompatibleResult => {
  if (!results.length) return true
  const firstResult =
    typeof results[0] === "function" ? results[0]() : results[0]
  if (firstResult === "partially") return "partially"

  for (const resultFn of results.slice(1)) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    if (result !== firstResult) return "partially"
  }

  return firstResult
}
