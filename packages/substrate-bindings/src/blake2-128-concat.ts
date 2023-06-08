import { mergeUint8 } from "@unstoppablejs/utils"
import { Encoder } from "scale-ts"
import { blake2b } from "@noble/hashes/blake2b"

export const blake2128Concat =
  (encoder: Encoder<any>) => (x: string | Uint8Array) => {
    const encoded = encoder(x)
    return mergeUint8(blake2b(encoded, { dkLen: 16 }), encoded)
  }
