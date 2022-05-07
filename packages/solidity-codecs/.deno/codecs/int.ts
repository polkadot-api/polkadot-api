import { Encoder, Codec } from "../types.ts"
import { toInternalBytes } from "../internal/index.ts"
import { createCodec } from "../utils.ts"

const signGetters: Record<1 | 2 | 8, "getBigInt64" | "getInt16" | "getInt8"> = {
  "1": "getInt8",
  "2": "getInt16",
  "8": "getBigInt64",
}

const signSetters: Record<1 | 2 | 8, "setBigInt64" | "setInt16" | "setInt8"> = {
  "1": "setInt8",
  "2": "setInt16",
  "8": "setBigInt64",
}

const usignGetters: Record<
  1 | 2 | 8,
  "getBigUint64" | "getUint16" | "getUint8"
> = {
  "1": "getUint8",
  "2": "getUint16",
  "8": "getBigUint64",
}

const usignSetters: Record<
  1 | 2 | 8,
  "setBigUint64" | "setUint16" | "setUint8"
> = {
  "1": "setUint8",
  "2": "setUint16",
  "8": "setBigUint64",
}

const getCodec = (nBytes: number): Codec<bigint> => {
  const n64 = (nBytes / 8) | 0
  const n16 = ((nBytes % 8) / 2) | 0
  const sequence = [
    ...Array(n64).fill([8, 64n, (x: bigint) => x]),
    ...Array(n16).fill([2, 16n, (x: bigint) => Number(x & 65535n)]),
  ]
  if (nBytes % 2) sequence.push([1, 8n, (x: bigint) => Number(x & 255n)])

  const enc: Encoder<bigint> = (input) => {
    const result = new Uint8Array(32)
    const dv = new DataView(result.buffer)

    let idx = 32
    for (let i = sequence.length - 1; i > 0; i--) {
      const [bytes, shift, fn] = sequence[i] as [1, 8n, (x: bigint) => any]
      idx -= bytes
      dv[usignSetters[bytes]](idx, fn(input) as never)
      input >>= shift
    }
    const [bytes, , fn] = sequence[0] as [1, 8n, (x: bigint) => any]
    idx -= bytes
    dv[signSetters[bytes]](idx, fn(input) as never)

    return result
  }

  const dec = toInternalBytes((bytes) => {
    let idx = bytes.i + 32 - nBytes

    const bits = sequence[0][0] as 8
    let result = BigInt(bytes.v[signGetters[bits]](idx))
    idx += bits

    for (let i = 1; i < sequence.length; i++) {
      const [bits, shift] = sequence[i] as [1, 8n]
      result = (result << shift) | BigInt(bytes.v[usignGetters[bits]](idx))
      idx += bits
    }

    bytes.i += 32
    return result
  })

  return createCodec(enc, dec)
}

const cache: Map<number, Codec<bigint>> = new Map()
export const int = (nBits: number): Codec<bigint> => {
  let cached = cache.get(nBits)
  if (cached) return cached

  const nBytes = nBits / 8
  cached = getCodec(nBytes)
  cache.set(nBits, cached)
  return cached
}

int.enc = (nBits: number) => int(nBits).enc
int.dec = (nBits: number) => int(nBits).dec
