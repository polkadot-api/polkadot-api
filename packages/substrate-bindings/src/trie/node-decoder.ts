import { createDecoder, Hex, u8, type HexString } from "../codecs"

const Headers = {
  Leaf: "Leaf",
  Branch: "Branch",
  BranchWithVal: "BranchWithVal",
  LeafWithHash: "LeafWithHash",
  BranchWithHash: "BranchWithHash",
  Empty: "Empty",
  Reserved: "Reserved",
} as const
type Headers = typeof Headers
type HeaderKey = (typeof Headers)[keyof typeof Headers]

export type NibleChar =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"

const varHex = Hex().dec
const allHex = Hex(Infinity).dec
const hex32 = Hex(32).dec
const byte = u8.dec

const getHeader = (
  bytes: Uint8Array,
): { type: HeaderKey; partialKey: string } => {
  const firstByte = byte(bytes)

  let bitsLeft = 6
  const typeId = firstByte >> bitsLeft
  const type: HeaderKey = typeId
    ? typeId === 1
      ? Headers.Leaf
      : typeId === 2
        ? Headers.Branch
        : Headers.BranchWithVal
    : firstByte >> --bitsLeft
      ? Headers.LeafWithHash
      : firstByte >> --bitsLeft
        ? Headers.BranchWithHash
        : firstByte
          ? Headers.Reserved
          : Headers.Empty

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

export type TrieNode = { partialKey: string } & (
  | {
      type: "Empty" | "Reserved"
    }
  | {
      type: "Leaf" | "LeafWithHash"
      value: HexString
    }
  | ({ children: Record<NibleChar, HexString> } & (
      | { type: "Branch" }
      | {
          type: "BranchWithHash" | "BranchWithVal"
          value: HexString
        }
    ))
)

export const trieNodeDec = createDecoder((bytes): TrieNode => {
  const header = getHeader(bytes)
  const { type } = header

  if (type === "Empty" || type === "Reserved") return header as TrieNode
  if (type === "Leaf" || type === "LeafWithHash")
    return {
      ...header,
      value: allHex(bytes),
    } as TrieNode

  const keys: string[] = []
  let current = byte(bytes)
  for (let i = 0; i < 8; i++) if ((current >> i) & 1) keys.push(i.toString(16))
  current = byte(bytes)
  for (let i = 0; i < 8; i++)
    if ((current >> i) & 1) keys.push((i + 8).toString(16))

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
