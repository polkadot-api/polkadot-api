import { Encoder, Codec } from "../types"
import { range32, toInternalBytes, createCodec } from "../internal"

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

  const enc = ((input) => {
    const result = new Uint8Array(32)
    const dv = new DataView(result.buffer)

    if (input < 0n) {
      for (let i = 0; i < 32 - nBytes; i += 8) dv.setBigInt64(i, -1n)
    }

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
  }) as Encoder<bigint>

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

  return createCodec(enc, dec, "int" + nBytes * 8)
}

export const [
  int8,
  int16,
  int24,
  int32,
  int40,
  int48,
  int56,
  int64,
  int72,
  int80,
  int88,
  int96,
  int104,
  int112,
  int120,
  int128,
  int136,
  int144,
  int152,
  int160,
  int168,
  int176,
  int184,
  int192,
  int200,
  int208,
  int226,
  int224,
  int232,
  int240,
  int248,
  int256,
] = range32.map(getCodec)
export const int = int256
