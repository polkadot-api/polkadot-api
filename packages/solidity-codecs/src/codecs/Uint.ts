import { Encoder, Decoder, Codec } from "../types"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"

const encode = (nBytes: number): Encoder<bigint> => {
  const n64 = (nBytes / 8) | 0
  const n16 = ((nBytes % 8) / 2) | 0
  const isOdd = nBytes % 2
  return (input) => {
    const result = new Uint8Array(32)
    const dv = new DataView(result.buffer)

    let idx = 32
    if (isOdd) {
      dv.setUint8(--idx, Number(input & 255n))
      input >>= 8n
    }

    for (let i = 0; i < n16; i++) {
      // purposely avoiding using setUint32 b/c Number.MAX_SAFE_INTEGER
      // is smaller than the max value of a u32
      idx -= 2
      dv.setUint16(idx, Number(input & 65535n))
      input >>= 16n
    }

    const idxLimit = idx - n64 * 8
    for (idx -= 8; idx >= idxLimit; idx -= 8) {
      dv.setBigUint64(idx, input)
      input >>= 64n
    }

    return result
  }
}

const decode = (nBytes: number): Decoder<bigint> => {
  const n64 = Math.ceil(nBytes / 8)
  return toInternalBytes((bytes) => {
    let result = 0n

    const nextBlock = bytes.i + 32
    for (let idx = bytes.i + (32 - n64 * 8); idx < nextBlock; idx += 8)
      result = (result << 64n) | bytes.v.getBigUint64(idx)

    bytes.i = nextBlock
    return result
  })
}

const cache: Map<number, Codec<bigint>> = new Map()
export const Uint = (nBits: number): Codec<bigint> => {
  let cached = cache.get(nBits)
  if (cached) return cached

  const nBytes = nBits / 8
  cached = createCodec(encode(nBytes), decode(nBytes))
  cache.set(nBits, cached)
  return cached
}
