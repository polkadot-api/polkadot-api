import { fromHex } from "@unstoppablejs/utils"
import { InternalUint8Array } from "./InternalUint8Array"
import type { Codec, Decoder, Encoder } from "./types"

export const toBuffer =
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

export const mapEncoder =
  <I, O>(encoder: Encoder<I>, mapper: (value: O) => I): Encoder<O> =>
  (value) =>
    encoder(mapper(value))

export const mapDecoder =
  <I, O>(decoder: Decoder<I>, mapper: (value: I) => O): Decoder<O> =>
  (value) =>
    mapper(decoder(value))

const viewMapper: Record<
  number,
  Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor
> = { 1: Uint8Array, 2: Uint16Array, 4: Uint32Array }

export const decodeUInt = (nBytes: number) =>
  toBuffer((buffer): number => {
    const mapper = viewMapper[nBytes]

    /* istanbul ignore next */
    if (!mapper) throw new Error("Not supported")

    const result = new viewMapper[nBytes](
      buffer.slice(buffer.usedBytes()).buffer,
      0,
      1,
    )[0]
    buffer.useBytes(nBytes)
    return result
  })

export const createCodec = <T>(
  encoder: Encoder<T>,
  decoder: Decoder<T>,
): Codec<T> => {
  const result = [encoder, decoder] as any
  result.enc = encoder
  result.dec = decoder
  return result
}

export const enhanceCodec = <I, O>(
  [encoder, decoder]: Codec<I>,
  toFrom: (value: O) => I,
  fromTo: (value: I) => O,
): Codec<O> =>
  createCodec(mapEncoder(encoder, toFrom), mapDecoder(decoder, fromTo))
