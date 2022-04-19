import { createCodec } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { toInternalBytes } from "../internal"

function decodeInt(nBytes: 8, getter: keyof DataView): Decoder<bigint>
function decodeInt(nBytes: number, getter: keyof DataView): Decoder<number>
function decodeInt(
  nBytes: number,
  getter: keyof DataView,
): Decoder<number> | Decoder<bigint> {
  return toInternalBytes((bytes) => {
    const result = (bytes.v[getter] as any)(bytes.i, true) as number
    bytes.i += nBytes
    return result
  })
}

function encodeInt(nBytes: 8, setter: keyof DataView): Encoder<bigint>
function encodeInt(nBytes: number, setter: keyof DataView): Encoder<number>
function encodeInt(
  nBytes: number,
  setter: keyof DataView,
): Encoder<number> | Encoder<bigint> {
  return (input: number | bigint) => {
    const result = new Uint8Array(nBytes)
    const dv = new DataView(result.buffer)
    ;(dv[setter] as any)(0, input, true)
    return result
  }
}

function intCodec(
  nBytes: 8,
  getter: keyof DataView,
  setter: keyof DataView,
): Codec<bigint>
function intCodec(
  nBytes: number,
  getter: keyof DataView,
  setter: keyof DataView,
): Codec<number>
function intCodec(
  nBytes: number,
  getter: keyof DataView,
  setter: keyof DataView,
): Codec<bigint> | Codec<number> {
  return createCodec(encodeInt(nBytes, setter), decodeInt(nBytes, getter))
}

export const u8 = intCodec(1, "getUint8", "setUint8")
export const u16 = intCodec(2, "getUint16", "setUint16")
export const u32 = intCodec(4, "getUint32", "setUint32")
export const u64 = intCodec(8, "getBigUint64", "setBigUint64")
export const i8 = intCodec(1, "getInt8", "setInt8")
export const i16 = intCodec(2, "getInt16", "setInt16")
export const i32 = intCodec(4, "getInt32", "setInt32")
export const i64 = intCodec(8, "getBigInt64", "setBigInt64")

const x128Enc: Encoder<bigint> = (value) => {
  const result = new Uint8Array(16)
  const dv = new DataView(result.buffer)
  dv.setBigInt64(0, value, true)
  dv.setBigInt64(8, value >> 64n, true)
  return result
}

const create128Dec = (isSigned?: number): Decoder<bigint> =>
  toInternalBytes((input) => {
    const { v, i } = input
    const right = v.getBigUint64(i, true)
    const left = v[isSigned ? "getBigInt64" : "getBigUint64"](i + 8, true)
    input.i += 16
    return (left << 64n) | right
  })

export const u128 = createCodec(x128Enc, create128Dec())
export const i128 = createCodec(x128Enc, create128Dec(1))
