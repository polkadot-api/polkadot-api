import { Decoder, Encoder } from "../types"
import { toInternalBytes } from "./toInternalBytes"

export const IntType = {
  u8: "u8",
  u16: "u16",
  u32: "u32",
  u64: "u64",
  i8: "i8",
  i16: "i16",
  i32: "i32",
  i64: "i64",
} as const
type IntType = typeof IntType[keyof typeof IntType]

const getterMap = {
  [IntType.u8]: [1, "getUint8", "setUint8"] as const,
  [IntType.u16]: [2, "getUint16", "setUint16"] as const,
  [IntType.u32]: [4, "getUint32", "setUint32"] as const,
  [IntType.u64]: [8, "getBigUint64", "setBigUint64"] as const,
  [IntType.i8]: [1, "getInt8", "setInt8"] as const,
  [IntType.i16]: [2, "getInt16", "setInt16"] as const,
  [IntType.i32]: [4, "getInt32", "setInt32"] as const,
  [IntType.i64]: [8, "getBigInt64", "setBigInt64"] as const,
} as const

export function decodeInt(intType: "i64" | "u64"): Decoder<bigint>
export function decodeInt(intType: IntType): Decoder<number>
export function decodeInt(intType: IntType): Decoder<number> | Decoder<bigint> {
  const [nBytes, getter] = getterMap[intType]
  return toInternalBytes((bytes) => {
    const result = bytes.v[getter](bytes.i, true) as number

    bytes.i += nBytes
    return result
  })
}

export function encodeInt(intType: "i64" | "u64"): Encoder<bigint>
export function encodeInt(intType: IntType): Encoder<number>
export function encodeInt(intType: IntType): Encoder<number> | Encoder<bigint> {
  const [nBytes, , setter] = getterMap[intType]
  return (input: number | bigint) => {
    const result = new Uint8Array(nBytes)
    const dv = new DataView(result.buffer)
    ;(dv[setter] as any)(0, input, true)
    return result
  }
}
