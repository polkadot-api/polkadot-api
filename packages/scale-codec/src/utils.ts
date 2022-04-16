import { fromHex } from "@unstoppablejs/utils"
import { InternalUint8Array } from "./InternalUint8Array"
import type { Codec, Decoder, Encoder } from "./types"

export const toInternalBytes =
  <T>(fn: (input: InternalUint8Array) => T): Decoder<T> =>
  (buffer: string | ArrayBuffer | Uint8Array | InternalUint8Array) =>
    fn(
      buffer instanceof InternalUint8Array
        ? buffer
        : new InternalUint8Array(
            typeof buffer === "string"
              ? fromHex(buffer).buffer
              : buffer instanceof Uint8Array
              ? buffer.buffer
              : buffer,
          ),
    )

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
    const result = new DataView(bytes.slice(bytes.usedBytes).buffer)[getter](
      0,
      true,
    ) as number

    bytes.useBytes(nBytes)
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

export const createCodec = <T>(
  encoder: Encoder<T>,
  decoder: Decoder<T>,
): Codec<T> => {
  const result = [encoder, decoder] as any
  result.enc = encoder
  result.dec = decoder
  return result
}

export const enhanceEncoder =
  <I, O>(encoder: Encoder<I>, mapper: (value: O) => I): Encoder<O> =>
  (value) =>
    encoder(mapper(value))

export const enhanceDecoder =
  <I, O>(decoder: Decoder<I>, mapper: (value: I) => O): Decoder<O> =>
  (value) =>
    mapper(decoder(value))

export const enhanceCodec = <I, O>(
  [encoder, decoder]: Codec<I>,
  toFrom: (value: O) => I,
  fromTo: (value: I) => O,
): Codec<O> =>
  createCodec(enhanceEncoder(encoder, toFrom), enhanceDecoder(decoder, fromTo))
