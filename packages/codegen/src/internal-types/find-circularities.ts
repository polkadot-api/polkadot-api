// import { LookupTypeNode } from "./type-representation"

import { LookupTypeNode } from "./type-representation"

// export function findCircularities(
//   start: LookupTypeNode,
//   exclude: Set<number>,
// ) {

// }

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
export function getReusedNodes(start: LookupTypeNode[], exclude: Set<number>) {}
