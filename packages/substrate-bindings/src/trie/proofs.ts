import { toHex } from "@polkadot-api/utils"
import { createDecoder, type HexString } from "../codecs"
import { type TrieNode, trieNodeDec } from "./node-decoder"
import { Blake2256 } from "@/hashes"

type Hasher = (input: Uint8Array) => Uint8Array

export type ProofTrieNode = {
  hash: HexString
  parent?: HexString
} & (TrieNode | { type: "Raw"; value: HexString })

export const TrieNodeWithHash = (hasher: Hasher) =>
  createDecoder((input): ProofTrieNode => {
    const hash = toHex(hasher(new Uint8Array(input.buffer)))
    try {
      return {
        hash,
        ...trieNodeDec(input),
      }
    } catch {
      // Sometimes the proofs include random raw-values which are not trie-nodes
      return { type: "Raw", hash, value: "" }
    }
  })

export const validateProofs = <T extends HexString | Uint8Array>(
  proofs: Array<T>,
  hasher: (input: Uint8Array) => Uint8Array = Blake2256,
): { rootHash: HexString; proofs: Record<HexString, ProofTrieNode> } | null => {
  const proofsList = proofs.map(TrieNodeWithHash(hasher))
  const proofsRecord = Object.fromEntries(proofsList.map((p) => [p.hash, p]))
  const hashes = proofsList.map((p) => p.hash)
  const roots = new Set(hashes)

  const setRawValue = (input: {
    type: "Raw"
    hash: HexString
    value: HexString
  }) => {
    if (input.value) return
    const val = proofs[hashes.indexOf(input.hash)!]
    input.value = typeof val === "string" ? val : toHex(val)
  }

  proofsList.forEach((p) => {
    if ("children" in p) {
      Object.values(p.children).forEach((hash) => {
        const child = proofsRecord[hash]
        if (child) {
          child.parent = p.hash
          roots.delete(hash)
        }
      })
    }

    if (p.type === "BranchWithHash" || p.type === "LeafWithHash") {
      const childHash = p.value
      const child = proofsRecord[childHash]
      if (!child) return

      roots.delete(childHash)
      if (child.type !== "Raw") {
        Object.keys(child).forEach((k) => delete (child as any)[k])
        ;(child as any).type = "Raw"
        child.hash = childHash
      }
      child.parent = p.hash
      setRawValue(child as any)
    }

    if (p.type === "Raw") setRawValue(p)
  })

  return roots.size === 1
    ? { rootHash: roots.values().next().value!, proofs: proofsRecord }
    : null
}
