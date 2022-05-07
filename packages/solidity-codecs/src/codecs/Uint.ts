import { Codec } from "../types"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"

const getCodec = (nBytes: number): Codec<bigint> => {
  const n64 = Math.ceil(nBytes / 8)
  return createCodec(
    (input) => {
      const result = new Uint8Array(32)
      const dv = new DataView(result.buffer)

      const idxLimit = 32 - n64 * 8
      for (let idx = 24; idx >= idxLimit; idx -= 8) {
        dv.setBigUint64(idx, input)
        input >>= 64n
      }

      return result
    },
    toInternalBytes((bytes) => {
      let result = 0n

      const nextBlock = bytes.i + 32
      for (let idx = bytes.i + (32 - n64 * 8); idx < nextBlock; idx += 8)
        result = (result << 64n) | bytes.v.getBigUint64(idx)

      bytes.i = nextBlock
      return result
    }),
  )
}

const cache: Map<number, Codec<bigint>> = new Map()
export const Uint = (nBits: number): Codec<bigint> => {
  let cached = cache.get(nBits)
  if (cached) return cached

  const nBytes = nBits / 8
  cached = getCodec(nBytes)
  cache.set(nBits, cached)
  return cached
}

Uint.enc = (nBits: number) => Uint(nBits).enc
Uint.dec = (nBits: number) => Uint(nBits).dec
