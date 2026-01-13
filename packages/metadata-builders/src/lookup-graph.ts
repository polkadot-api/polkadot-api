import { LookupEntry } from "./lookups"

export type LookupGraph = Map<
  number,
  { entry: LookupEntry; backRefs: Set<number>; refs: Set<number> }
>

export function buildLookupGraph(
  lookupFn: (id: number) => LookupEntry,
  lookupLength: number,
): LookupGraph {
  const result: LookupGraph = new Map()
  const visited = new Set<number>()

  const addEdge = (from: number, to: number) => {
    if (!result.has(from))
      result.set(from, {
        entry: lookupFn(from),
        backRefs: new Set(),
        refs: new Set(),
      })
    if (!result.has(to))
      result.set(to, {
        entry: lookupFn(to),
        backRefs: new Set(),
        refs: new Set(),
      })
    result.get(from)!.refs.add(to)
    result.get(to)!.backRefs.add(from)
  }

  for (let i = 0; i < lookupLength; i++) {
    const entry = lookupFn(i)
    if (i !== entry.id) {
      // Lookup solved a pointer, but we still need to add that node into our
      // graph in case someone access it from there.
      addEdge(i, entry.id)
    }
    if (visited.has(entry.id)) continue
    visited.add(entry.id)

    switch (entry.type) {
      case "array":
      case "option":
      case "sequence":
        addEdge(entry.id, entry.value.id)
        break
      case "enum":
        Object.values(entry.value).forEach((enumEntry) => {
          switch (enumEntry.type) {
            case "array":
            case "lookupEntry":
              addEdge(entry.id, enumEntry.value.id)
              break
            case "struct":
            case "tuple":
            case "namedTuple":
              Object.values(enumEntry.value).forEach((v) =>
                addEdge(entry.id, v.id),
              )
              break
          }
        })
        break
      case "result":
        addEdge(entry.id, entry.value.ok.id)
        addEdge(entry.id, entry.value.ko.id)
        break
      case "struct":
      case "tuple":
        Object.values(entry.value).forEach((v) => addEdge(entry.id, v.id))
        break
    }

    // It could be that this node is not being referenced by any other type
    // nor it references anything. We still have to add it into the graph.
    if (!result.has(entry.id)) {
      result.set(entry.id, {
        backRefs: new Set(),
        refs: new Set(),
        entry,
      })
    }
  }

  return result
}

const subgraphCache = new WeakMap<LookupGraph, Map<number, LookupGraph>>()
function _getSubgraph(
  id: number,
  graph: LookupGraph,
  result: LookupGraph,
  cache: Map<number, LookupGraph>,
) {
  if (result.has(id)) return
  const node = graph.get(id)!
  result.set(id, node)
  cache.set(id, result)

  node.refs.forEach((ref) => _getSubgraph(ref, graph, result, cache))
  node.backRefs.forEach((ref) => _getSubgraph(ref, graph, result, cache))
}

export function getSubgraph(id: number, graph: LookupGraph) {
  if (!subgraphCache.has(graph)) {
    subgraphCache.set(graph, new Map())
  }
  const cache = subgraphCache.get(graph)!
  if (cache.has(id)) return cache.get(id)!

  const result: LookupGraph = new Map()
  _getSubgraph(id, graph, result, cache)
  return result
}

export function getStronglyConnectedComponents(graph: LookupGraph) {
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

    const edges = graph.get(v)!.refs
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

      result.push(component)
    }
  }

  for (const node of graph.keys()) {
    if (!tarjanState.has(node)) {
      strongConnect(node)
    }
  }

  return result
}

export function mergeSCCsWithCommonNodes(
  stronglyConnectedComponents: Array<Set<number>>,
) {
  /**
   * For Nodes that are shared between two sets of SCCs, we need to calculate
   * the checksum for the both of them, which wouldn't work (it would give
   * different checksums).
   * So we merge the SCCs that are using shared nodes into one group.
   */
  const scc = stronglyConnectedComponents
  const ungroupedCycles = new Set(scc.map((_, i) => i))
  const edges = new Map(scc.map((_, i) => [i, new Set<number>()]))
  scc.forEach((cycle, i) => {
    scc.slice(i + 1).forEach((otherCycle, _j) => {
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
    const toVisit = [ungroupedCycles.values().next().value!]
    while (toVisit.length) {
      const idx = toVisit.pop()!
      if (!ungroupedCycles.has(idx)) continue
      ungroupedCycles.delete(idx)

      const cycle = scc[idx]
      cycle.forEach((v) => group.add(Number(v)))
      edges.get(idx)!.forEach((n) => toVisit.push(n))
    }
    groups.push(group)
  }

  return groups
}
