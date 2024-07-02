import type {
  ArrayNode,
  EnumNode,
  OptionNode,
  ResultNode,
  StructNode,
  TerminalNode,
  TupleNode,
  TypedefNode,
} from "./typedef"

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

  return isPartially ? "partially" : true
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
