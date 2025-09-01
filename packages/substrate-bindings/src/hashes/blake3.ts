import { mergeUint8 } from "@polkadot-api/utils"
import { blake3 } from "@noble/hashes/blake3.js"

const len32 = { dkLen: 32 }
export const Blake3256 = (encoded: Uint8Array) => blake3(encoded, len32)

export const Blake3256Concat = (encoded: Uint8Array) =>
  mergeUint8([Blake3256(encoded), encoded])
