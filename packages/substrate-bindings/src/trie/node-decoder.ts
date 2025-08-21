import { createDecoder, Hex, u16, u8, type HexString } from "../codecs"
import { type TrieNodeHeaderKey, TrieNodeHeaders, type TrieNode } from "./types"

const varHex = Hex().dec
const allHex = Hex(Infinity).dec
const hex32 = Hex(32).dec
const byte = u8.dec

const getHeader = (
  bytes: Uint8Array,
): { type: TrieNodeHeaderKey; partialKey: string } => {
  const firstByte = byte(bytes)

  let bitsLeft = 6
  const typeId = firstByte >> bitsLeft
  const type: TrieNodeHeaderKey = typeId
    ? typeId === 1
      ? TrieNodeHeaders.Leaf
      : typeId === 2
        ? TrieNodeHeaders.Branch
        : TrieNodeHeaders.BranchWithVal
    : firstByte >> --bitsLeft
      ? TrieNodeHeaders.LeafWithHash
      : firstByte >> --bitsLeft
        ? TrieNodeHeaders.BranchWithHash
        : firstByte
          ? TrieNodeHeaders.Reserved
          : TrieNodeHeaders.Empty

  let nNibles = firstByte & (0xff >> (8 - bitsLeft))
  if (nNibles === 2 ** bitsLeft - 1) {
    let current: number
    do nNibles += current = byte(bytes)
    while (current === 255)
  }

  return {
    type,
    partialKey: Hex(Math.ceil(nNibles / 2))
      .dec(bytes)
      .slice(nNibles % 2 ? 3 : 2),
  }
}

export const trieNodeDec = createDecoder((bytes): TrieNode => {
  const header = getHeader(bytes)
  const { type } = header

  if (type === "Empty" || type === "Reserved") return header as TrieNode
  if (type === "Leaf" || type === "LeafWithHash")
    return {
      ...header,
      value: allHex(bytes),
    } as TrieNode

  const bitmap = u16.dec(bytes)
  const keys: string[] = []
  for (let i = 0; i < 16; i++) if ((bitmap >> i) & 1) keys.push(i.toString(16))

  let value: null | HexString = null
  if (type === "BranchWithVal") value = varHex(bytes)
  if (type === "BranchWithHash") value = hex32(bytes)

  const result: any = {
    ...header,
    children: Object.fromEntries(keys.map((key) => [key, varHex(bytes)])),
  }
  if (value !== null) result.value = value
  return result
})
