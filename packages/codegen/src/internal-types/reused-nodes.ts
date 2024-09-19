import { LookupTypeNode, TypeNode } from "./type-representation"

/**
 * Given a list of starting points, returns those nodes that are being shared by
 * multiple paths.
 *
 * This can be used to avoid generating intermediate types which are being used
 * from just one single point.
 *
 * `exclude` is a set of ids to stop exploring. E.g. known types.
 * It might be a good idea to also have the excluded types as part of the entry
 * points.
 *
 * It might return types in the `start` or `exclude` set if those are being
 * referenced from more than one path.
 */
export function getReusedNodes(start: LookupTypeNode[], exclude: Set<number>) {
  const reused = new Set<number>()
  const visited = new Set<number>()
  let heads = [...start]

  while (heads.length) {
    const head = heads.pop()!
    if (visited.has(head.id)) {
      reused.add(head.id)
      continue
    }
    visited.add(head.id)
    if (exclude.has(head.id)) {
      continue
    }

    heads = [...heads, ...getEdges(head)]
  }

  return reused
}

const unique = <T>(arr: T[]) => [...new Set(arr)]

function getEdges(node: TypeNode): LookupTypeNode[] {
  switch (node.type) {
    case "array":
      return [node.value.value]
    case "enum":
      // enum entries can be undefined => []
      // enum entries can be lookupEntries => [lookupEntry]
      // enum entries can be inline array/structs/etc => getEdges(_)
      return unique(
        node.value.flatMap((v) =>
          v.value ? ("id" in v.value ? [v.value] : getEdges(v.value)) : [],
        ),
      )
    case "option":
      return [node.value]
    case "result":
      return [node.value.ok, node.value.ko]
    case "struct":
    case "tuple":
      return unique(node.value.map((v) => v.value))
    case "union":
      return unique(node.value.flatMap((v) => ("id" in v ? [v] : getEdges(v))))
    case "chainPrimitive":
    case "fixedSizeBinary":
    case "primitive":
      return []
  }
}
