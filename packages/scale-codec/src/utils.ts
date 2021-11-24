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

const getterMap = {
  1: "getUint8" as const,
  2: "getUint16" as const,
  4: "getUint32" as const,
  8: "getBigUint64" as const,
}

export function decodeUInt(nBytes: 1 | 2 | 4): Decoder<number>
export function decodeUInt(nBytes: 8): Decoder<bigint>
export function decodeUInt(
  nBytes: 1 | 2 | 4 | 8,
): Decoder<number> | Decoder<bigint> {
  return toInternalBytes((bytes) => {
    const getter = getterMap[nBytes]

    const result = new DataView(bytes.slice(bytes.usedBytes).buffer)[getter](
      0,
      true,
    ) as number

    bytes.useBytes(nBytes)
    return result
  })
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
