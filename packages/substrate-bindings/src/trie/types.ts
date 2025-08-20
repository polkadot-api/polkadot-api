import { type HexString } from "../codecs"

export const TrieNodeHeaders = {
  Leaf: "Leaf",
  Branch: "Branch",
  BranchWithVal: "BranchWithVal",
  LeafWithHash: "LeafWithHash",
  BranchWithHash: "BranchWithHash",
  Empty: "Empty",
  Reserved: "Reserved",
} as const
type TrieNodeHeaders = typeof TrieNodeHeaders
export type TrieNodeHeaderKey =
  (typeof TrieNodeHeaders)[keyof typeof TrieNodeHeaders]

export type Nibble =
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

export type TrieNode = { partialKey: string } & (
  | {
      type: TrieNodeHeaders["Empty"] | TrieNodeHeaders["Reserved"]
    }
  | {
      type: TrieNodeHeaders["Leaf"] | TrieNodeHeaders["LeafWithHash"]
      value: HexString
    }
  | ({ children: Record<Nibble, HexString> } & (
      | { type: TrieNodeHeaders["Branch"] }
      | {
          type:
            | TrieNodeHeaders["BranchWithHash"]
            | TrieNodeHeaders["BranchWithVal"]
          value: HexString
        }
    ))
)
export type ProofTrieNode = {
  hash: HexString
  parent?: HexString
} & (TrieNode | { type: "Raw"; value: HexString })
