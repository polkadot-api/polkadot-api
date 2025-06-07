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

export type Change = {
  path: string
  id: [number | null, number | null]
  level: CompatibilityLevel
}
export type StaticCompatibleResult = {
  level: CompatibilityLevel
  // paths causing the compatibility level. Doesn't return `Identical` paths.
  changes: Array<Change>
  // set of nodes that are assumed "Identical" (used with circular references)
  assumptions: DoubleSet<TypedefNode>
}
export type CompatibilityCache = Map<
  TypedefNode,
  Map<TypedefNode, { level: CompatibilityLevel; changes: Array<Change> } | null>
>
export function isStaticCompatible(
  originNode: TypedefNode | undefined,
  getOriginNode: (id: number) => TypedefNode,
  destNode: TypedefNode | undefined,
  getDestNode: (id: number) => TypedefNode,
  cache: CompatibilityCache,
  deep = false,
): StaticCompatibleResult {
  if (!destNode && !originNode) {
    return unconditional(CompatibilityLevel.Identical, [])
  }
  if (!destNode)
    return unconditional(CompatibilityLevel.BackwardsCompatible, [])
  if (!originNode)
    return unconditional(
      destNode.type === "option"
        ? CompatibilityLevel.BackwardsCompatible
        : CompatibilityLevel.Incompatible,
      [],
    )

  if (!cache.has(destNode)) {
    cache.set(destNode, new Map())
  }
  const destNodeCache = cache.get(destNode)!
  if (destNodeCache.has(originNode)) {
    const result = destNodeCache.get(originNode)
    if (result == null) {
      // Circular reference hit, return Identical with assumption
      return {
        level: CompatibilityLevel.Identical,
        changes: [],
        assumptions: new DoubleSet([[originNode, destNode]]),
      }
    }
    return unconditional(result.level, result.changes)
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
    deep,
  )

  result.assumptions.delete(originNode, destNode)
  if (
    result.assumptions.isEmpty() ||
    result.level === CompatibilityLevel.Incompatible
  ) {
    destNodeCache.set(originNode, result)
  } else {
    // Remove the temporary `null` value from the cache
    destNodeCache.delete(originNode)
  }
  return result
}

function getIsStaticCompatible(
  originNode: TypedefNode,
  destNode: TypedefNode,
  next: (
    originNode: TypedefNode | number | undefined,
    destNode: TypedefNode | number | undefined,
  ) => StaticCompatibleResult,
  deep: boolean,
): StaticCompatibleResult {
  const nextCall = (
    originNode: TypedefNode | number | undefined,
    destNode: TypedefNode | number | undefined,
    path: string,
  ): StaticCompatibleResult => {
    const result = next(originNode, destNode)
    return {
      ...result,
      changes:
        result.level < CompatibilityLevel.Identical
          ? [
              {
                id: [
                  typeof originNode === "number" ? originNode : null,
                  typeof destNode === "number" ? destNode : null,
                ],
                level: result.level,
                path,
              },
            ]
          : [],
    }
  }

  if (originNode.type !== destNode.type) {
    if (destNode.type === "option") {
      return withMaxLevel(
        nextCall(originNode, destNode.value, "some"),
        CompatibilityLevel.BackwardsCompatible,
      )
    }
    if (originNode.type === "option") {
      return withMaxLevel(
        nextCall(originNode.value, destNode, "some"),
        CompatibilityLevel.Partial,
      )
    }
    return unconditional(CompatibilityLevel.Incompatible, [])
  }

  switch (destNode.type) {
    case "terminal":
      return unconditional(
        destNode.value.type === (originNode as TerminalNode).value.type
          ? CompatibilityLevel.Identical
          : CompatibilityLevel.Incompatible,
        [],
      )
    case "binary":
      const binaryOrigin = originNode as BinaryNode
      return lengthChange(
        compareOptionalLengths(binaryOrigin.value, destNode.value),
      )
    case "array":
      const arrayOrigin = originNode as ArrayNode
      const lengthCheck = lengthChange(
        compareOptionalLengths(arrayOrigin.value.length, destNode.value.length),
      )
      return strictMerge(
        [
          lengthCheck,
          () =>
            nextCall(
              arrayOrigin.value.typeRef,
              destNode.value.typeRef,
              "value",
            ),
        ],
        deep,
      )
    case "enum": {
      const enumOrigin = originNode as EnumNode
      const destVariants = Object.fromEntries(
        destNode.value.map(([key, value]) => [key, value.value]),
      )

      // check whether every possible `origin` value is compatible with dest
      let enumResults = mergeResults(
        enumOrigin.value.map(
          ([type, value]) =>
            () =>
              type in destVariants
                ? nextCall(value.value, destVariants[type], type)
                : unconditional(CompatibilityLevel.Incompatible, [
                    {
                      id: [
                        typeof value.value === "number" ? value.value : null,
                        null,
                      ],
                      level: CompatibilityLevel.Incompatible,
                      path: type,
                    },
                  ]),
        ),
      )
      if (enumOrigin.value.length === destNode.value.length) return enumResults
      enumResults = withMaxLevel(
        enumResults,
        CompatibilityLevel.BackwardsCompatible,
      )

      // Then add in the missing values as incompatible changes
      const enumOriginVariants = new Set(enumOrigin.value.map(([key]) => key))
      enumResults.changes = [
        ...enumResults.changes,
        ...destNode.value
          .filter(([key]) => !enumOriginVariants.has(key))
          .map(
            ([key, value]): Change => ({
              id: [null, typeof value === "number" ? value : null],
              level: CompatibilityLevel.Incompatible,
              path: key,
            }),
          ),
      ]
      return enumResults
    }
    case "option":
      return withMinLevel(
        nextCall((originNode as OptionNode).value, destNode.value, "some"),
        CompatibilityLevel.Partial,
      )
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
                nextCall(originProperties[key], value, key),
          ),
          deep,
        ),
        maxLevel,
      )
    case "tuple": {
      const tupleOrigin = originNode as TupleNode
      const lengthCheck = lengthChange(
        compareArrayLengths(tupleOrigin.value, destNode.value),
      )
      return strictMerge(
        [
          lengthCheck,
          ...destNode.value.map(
            (value, idx) => () =>
              nextCall(tupleOrigin.value[idx], value, String(idx)),
          ),
        ],
        deep,
      )
    }
    case "result":
      const resultOrigin = originNode as ResultNode
      return mergeResults([
        nextCall(resultOrigin.value.ok, destNode.value.ok, "ok"),
        nextCall(resultOrigin.value.ko, destNode.value.ko, "ko"),
      ])
  }
}

const withMaxLevel = (
  result: StaticCompatibleResult,
  level: CompatibilityLevel,
): StaticCompatibleResult => ({
  // Changes stay the same. Use case: Option<Incompatible>, the option should show up as Partial, but the change should indicate that the inner one is incompatible.
  ...result,
  // Confusing yes, but it's Math.min. If we do withMaxLevel(result, 1), we expect to get at most [1] as a result
  level: Math.min(result.level, level),
})
const withMinLevel = (
  result: StaticCompatibleResult,
  level: CompatibilityLevel,
): StaticCompatibleResult => ({
  ...result,
  level: Math.max(result.level, level),
})

const noAssumptions = new DoubleSet<TypedefNode>()
const unconditional = (
  level: CompatibilityLevel,
  changes: Array<Change>,
): StaticCompatibleResult => ({
  level,
  changes,
  assumptions: noAssumptions,
})

/**
 * Merges multiple results, following the most "strict" one, (semantically an
 * AND)
 */
const strictMerge = (
  results: Array<StaticCompatibleResult | (() => StaticCompatibleResult)>,
  deep: boolean,
): StaticCompatibleResult => {
  let merged = unconditional(CompatibilityLevel.Identical, [])

  for (const resultFn of results) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    // On early return we don't need to keep the other assumptions
    if (!deep && result.level === CompatibilityLevel.Incompatible) return result

    if (result.level !== CompatibilityLevel.Identical)
      merged.changes = [...merged.changes, ...result.changes]
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
  if (!results.length) return unconditional(CompatibilityLevel.Identical, [])

  let hasCompatibles = false

  let merged = unconditional(CompatibilityLevel.Identical, [])
  for (const resultFn of results) {
    const result = typeof resultFn === "function" ? resultFn() : resultFn
    if (result.level !== CompatibilityLevel.Identical)
      merged.changes = [...merged.changes, ...result.changes]
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
    : unconditional(CompatibilityLevel.Incompatible, merged.changes)
}

const lengthChange = (level: CompatibilityLevel): StaticCompatibleResult => ({
  assumptions: noAssumptions,
  changes:
    level === CompatibilityLevel.Identical
      ? []
      : [
          {
            id: [null, null],
            level,
            path: "length",
          },
        ],
  level,
})

const compareArrayLengths = (
  origin: unknown[],
  dest: unknown[],
): CompatibilityLevel =>
  dest.length === origin.length
    ? CompatibilityLevel.Identical
    : origin.length >= dest.length
      ? CompatibilityLevel.BackwardsCompatible
      : CompatibilityLevel.Incompatible

const compareOptionalLengths = (
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
