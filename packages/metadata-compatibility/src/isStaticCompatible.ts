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
        destNode.value.length === undefined
          ? true
          : arrayOrigin.value.length === undefined
            ? "partially"
            : arrayOrigin.value.length >= destNode.value.length
      return strictMerge([
        () => lengthCheck,
        () => nextCall(arrayOrigin.value.typeRef, destNode.value.typeRef),
      ])
    case "enum":
      const enumOrigin = originNode as EnumNode
      const destVariants = Object.fromEntries(destNode.value)
      // check whether every possible `origin` value is compatible with dest
      return mergeResults(
        enumOrigin.value.map(
          ([type, value]) =>
            () =>
              type in destVariants
                ? nextCall(value ?? null, destVariants[type] ?? null)
                : false,
        ),
      )
    case "option":
      return nextCall((originNode as OptionNode).value, destNode.value)
    case "struct":
      const structOrigin = originNode as StructNode
      const originProperties = Object.fromEntries(structOrigin.value)
      return strictMerge(
        destNode.value.map(
          ([key, value]) =>
            () =>
              nextCall(originProperties[key], value),
        ),
      )
    case "tuple":
      const tupleOrigin = originNode as TupleNode
      return strictMerge([
        destNode.value.length <= tupleOrigin.value.length,
        ...destNode.value.map(
          (value, idx) => () => nextCall(tupleOrigin.value[idx], value),
        ),
      ])
    case "result":
      const resultOrigin = originNode as ResultNode
      return mergeResults([
        nextCall(resultOrigin.value.ok, destNode.value.ok),
        nextCall(resultOrigin.value.ko, destNode.value.ko),
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
