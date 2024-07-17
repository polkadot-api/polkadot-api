import { DoubleSet } from "./doubleSet"
import type {
  ArrayNode,
  BinaryNode,
  EnumNode,
  OptionNode,
  ResultNode,
  StructNode,
  TerminalNode,
  TupleNode,
  TypedefNode,
} from "./typedef"

export enum CompatibilityLevel {
  // No possible value from origin will be compatible with dest
  Incompatible = 0,
  // Some values of origin will be compatible with dest
  Partial,
  // Every value from origin will be compatible with dest
  BackwardsCompatible,
  // Types are identical
  Identical,
}

/*
 * We have to be careful with circular references and early returns with the cache.
 *
 * For early returns, the resulting level could be even lower when exploring other branches.
 * This means that we can't store early returns in the cache. For simplicity, the
 * initial implementation will not have early returns.
 * It should be possible to store in the cache what was the CompatibilityLevel that
 * caused the early return, so that if the same call is done with the same CompatibilityLevel
 * we could still leverage the cache.
 *
 * For circular references, the simplest solution is to assume that the circular
 * node is fully-compatible (Identical). But then any node that is reading from it
 * can't be cached because its result will be doing the assumption that the circular
 * node is `Identical`.
 * Only once the whole cycle has completed, then the circular node can actually
 * cache its own result (TODO check this assumption is fine), and then any other
 * node that referenced it can also safely cache.
 * We have to think cases where there could be two cycles:
 *         F ← E
 *         ↓   ↑
 * A → B → C → D
 *     ↑       ↓
 *     I ← H ← G
 *
 * B = 4 => B = 1
 * B = 1 => B = 0
 *
 * As we're going depth-first, when we reach C from F, we will return a "temporary"
 * `Identical`. This means that F, E or D can't be cached. But then we continue
 * depth-first into G-H-I-B, then detect the cycle and return a "temporary" `Identical`.
 * Then I, H, G and C can't be cached because they actually depend on the temporary result of B.
 * B on the other hand will be able to cache its own result, and so does A.
 *
 * If a new call enters the cycle from D, then the branch G-H-I-B will be cached.
 * But the cycle D-E-F-C will make E-F-C not to cache their result yet.
 *
 *
 * => Maybe instead of having two separate [originNode, destNode] we can first merge
 * both trees into one, and then run the search? This would simplify the double-map/set stuff.
 * Can it be done lazily though? In a way that we don't need to go through the whole tree?
 */

export type StaticCompatibleResult = {
  level: CompatibilityLevel
  assumptions: DoubleSet<TypedefNode>
}
export type CompatibilityCache = Map<
  TypedefNode,
  Map<TypedefNode, CompatibilityLevel | null>
>
export function isStaticCompatible(
  originNode: TypedefNode | undefined,
  getOriginNode: (id: number) => TypedefNode,
  destNode: TypedefNode | undefined,
  getDestNode: (id: number) => TypedefNode,
  cache: CompatibilityCache,
): StaticCompatibleResult {
  if (!destNode && !originNode) {
    return unconditional(CompatibilityLevel.Identical)
  }
  if (!destNode) return unconditional(CompatibilityLevel.BackwardsCompatible)
  if (!originNode)
    return unconditional(
      destNode.type === "option"
        ? CompatibilityLevel.BackwardsCompatible
        : CompatibilityLevel.Incompatible,
    )

  if (!cache.has(destNode)) {
    cache.set(destNode, new Map())
  }
  const destNodeCache = cache.get(destNode)!
  if (destNodeCache.has(originNode)) {
    const result = destNodeCache.get(originNode)
    if (result === null) {
      // Circular reference hit, return Identical with assumption
      return {
        level: CompatibilityLevel.Identical,
        assumptions: new DoubleSet([[originNode, destNode]]),
      }
    }
    return unconditional(result!)
  }

  // Initialize to null for detecting circular references
  destNodeCache.set(originNode, null)

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

  result.assumptions.delete(originNode, destNode)
  if (
    result.assumptions.isEmpty() ||
    result.level === CompatibilityLevel.Incompatible
  ) {
    destNodeCache.set(originNode, result.level)
  } else {
    // Remove the temporary `null` value from the cache
    destNodeCache.delete(originNode)
  }
  return result
}

function getIsStaticCompatible(
  originNode: TypedefNode,
  destNode: TypedefNode,
  nextCall: (
    originNode: TypedefNode | number | undefined,
    destNode: TypedefNode | number | undefined,
  ) => StaticCompatibleResult,
): StaticCompatibleResult {
  if (originNode.type !== destNode.type) {
    if (destNode.type === "option") {
      return withMaxLevel(
        nextCall(originNode, destNode.value),
        CompatibilityLevel.BackwardsCompatible,
      )
    }
    if (originNode.type === "option") {
      return withMaxLevel(
        nextCall(originNode.value, destNode),
        CompatibilityLevel.Partial,
      )
    }
    return unconditional(CompatibilityLevel.Incompatible)
  }

  switch (destNode.type) {
    case "terminal":
      return unconditional(
        destNode.value.type === (originNode as TerminalNode).value.type
          ? CompatibilityLevel.Identical
          : CompatibilityLevel.Incompatible,
      )
    case "binary":
      const binaryOrigin = originNode as BinaryNode
      return unconditional(
        compareOptionalLengths(binaryOrigin.value, destNode.value),
      )
    case "array":
      const arrayOrigin = originNode as ArrayNode
      const lengthCheck = unconditional(
        compareOptionalLengths(arrayOrigin.value.length, destNode.value.length),
      )
      return strictMerge([
        lengthCheck,
        () => nextCall(arrayOrigin.value.typeRef, destNode.value.typeRef),
      ])
    case "enum": {
      const enumOrigin = originNode as EnumNode
      const destVariants = Object.fromEntries(destNode.value)
      const maxLevel =
        enumOrigin.value.length === destNode.value.length
          ? CompatibilityLevel.Identical
          : CompatibilityLevel.BackwardsCompatible

      // check whether every possible `origin` value is compatible with dest
      return withMaxLevel(
        mergeResults(
          enumOrigin.value.map(
            ([type, value]) =>
              () =>
                type in destVariants
                  ? nextCall(value, destVariants[type])
                  : unconditional(CompatibilityLevel.Incompatible),
          ),
        ),
        maxLevel,
      )
    }
    case "option":
      return nextCall((originNode as OptionNode).value, destNode.value)
    case "struct":
      const structOrigin = originNode as StructNode
      const originProperties = Object.fromEntries(structOrigin.value)
      const maxLevel =
        structOrigin.value.length === destNode.value.length
          ? CompatibilityLevel.Identical
          : CompatibilityLevel.BackwardsCompatible

      return withMaxLevel(
        strictMerge(
          destNode.value.map(
            ([key, value]) =>
              () =>
                nextCall(originProperties[key], value),
          ),
        ),
        maxLevel,
      )
    case "tuple": {
      const tupleOrigin = originNode as TupleNode
      const lengthCheck = unconditional(
        compareArrayLengths(tupleOrigin.value, destNode.value),
      )
      return strictMerge([
        lengthCheck,
        ...destNode.value.map(
          (value, idx) => () => nextCall(tupleOrigin.value[idx], value),
        ),
      ])
    }
    case "result":
      const resultOrigin = originNode as ResultNode
      return mergeResults([
        nextCall(resultOrigin.value.ok, destNode.value.ok),
        nextCall(resultOrigin.value.ko, destNode.value.ko),
      ])
  }
}

const withMaxLevel = (
  result: StaticCompatibleResult,
  level: CompatibilityLevel,
): StaticCompatibleResult => ({
  ...result,
  // Confusing yes, but it's Math.min. If we do withMaxLevel(result, 1), we expect to get at most [1] as a result
  level: Math.min(result.level, level),
})
const noAssumptions = new DoubleSet<TypedefNode>()
export const unconditional = (
  level: CompatibilityLevel,
): StaticCompatibleResult => ({
  level,
  assumptions: noAssumptions,
})

/**
 * Merges multiple results, following the most "strict" one, (semantically an
 * AND)
 */
export const strictMerge = (
  results: Array<StaticCompatibleResult | (() => StaticCompatibleResult)>,
): StaticCompatibleResult => {
  let merged = unconditional(CompatibilityLevel.Identical)

  for (const resultFn of results) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    // On early return we don't need to keep the other assumptions
    if (result.level === CompatibilityLevel.Incompatible) return result

    merged.assumptions.addAll(result.assumptions.values)
    merged.level = Math.min(merged.level, result.level)
  }

  return merged
}

/**
 * Merges multiple results, going to `partially` (semantically an OR)
 */
const mergeResults = (
  results: Array<StaticCompatibleResult | (() => StaticCompatibleResult)>,
): StaticCompatibleResult => {
  if (!results.length) return unconditional(CompatibilityLevel.Identical)

  let hasCompatibles = false

  let merged = unconditional(CompatibilityLevel.Identical)
  for (const resultFn of results) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    if (result.level === CompatibilityLevel.Incompatible) {
      merged.level = Math.min(merged.level, CompatibilityLevel.Partial)
      continue
    }
    hasCompatibles = true

    merged.assumptions.addAll(result.assumptions.values)
    merged.level = Math.min(merged.level, result.level)
  }

  return hasCompatibles
    ? merged
    : unconditional(CompatibilityLevel.Incompatible)
}

export const compareArrayLengths = (
  origin: unknown[],
  dest: unknown[],
): CompatibilityLevel =>
  dest.length === origin.length
    ? CompatibilityLevel.Identical
    : origin.length >= dest.length
      ? CompatibilityLevel.BackwardsCompatible
      : CompatibilityLevel.Incompatible

export const compareOptionalLengths = (
  origin: number | undefined,
  dest: number | undefined,
): CompatibilityLevel =>
  dest === origin
    ? CompatibilityLevel.Identical
    : dest == null || origin! >= dest
      ? CompatibilityLevel.BackwardsCompatible
      : origin == null
        ? CompatibilityLevel.Partial
        : CompatibilityLevel.Incompatible
