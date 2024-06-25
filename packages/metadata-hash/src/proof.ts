export function getProof(
  leaves: Array<Uint8Array>,
  knownLeavesIdxs: Array<number>,
  hashesTree: Array<Uint8Array>,
) {
  const knownLeaves = knownLeavesIdxs.map((idx) => leaves[idx])

  const startingIdx = leaves.length - 1
  const leafIdxs = knownLeavesIdxs.map((idx) => startingIdx + idx)

  const known = new Set(leafIdxs)
  const proofs: Array<Uint8Array> = []

  for (let i = hashesTree.length - 2; i > 0; i -= 2) {
    let left = i
    let right = i + 1

    if (!known.has(left) && !known.has(right)) continue

    known.add((i - 1) / 2)
    if (known.has(left) && known.has(right)) continue

    const proof = hashesTree[known.has(left) ? right : left]
    proofs.unshift(proof)
  }

  return {
    leaves: knownLeaves,
    leafIdxs,
    nodes: proofs,
  }
}
