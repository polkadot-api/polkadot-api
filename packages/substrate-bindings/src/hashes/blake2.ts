import { blake2b } from "@noble/hashes/blake2b"
import { mergeUint8 } from "@unstoppablejs/utils"
import { Endomorphism } from "fp-ts/lib/Endomorphism"

const len32 = { dkLen: 32 }
export const Blake2256: Endomorphism<Uint8Array> = (encoded) =>
  blake2b(encoded, len32)

const len16 = { dkLen: 16 }
export const Blake2128: Endomorphism<Uint8Array> = (encoded) =>
  blake2b(encoded, len16)

export const Blake2128Concat: Endomorphism<Uint8Array> = (encoded) =>
  mergeUint8(Blake2128(encoded), encoded)
