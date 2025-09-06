import { keccak_256 } from "@noble/hashes/sha3.js"

export const Keccak256: (input: Uint8Array) => Uint8Array = keccak_256
