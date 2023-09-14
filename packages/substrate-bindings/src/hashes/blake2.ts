import { mergeUint8 } from "@polkadot-api/utils"
import { blake2b } from "@noble/hashes/blake2b"

const len32 = { dkLen: 32 }
export const Blake2256 = (encoded: Uint8Array) => blake2b(encoded, len32)

const len16 = { dkLen: 16 }
export const Blake2128 = (encoded: Uint8Array) => blake2b(encoded, len16)

export const Blake2128Concat = (encoded: Uint8Array) =>
  mergeUint8(Blake2128(encoded), encoded)
