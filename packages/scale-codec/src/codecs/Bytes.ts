import { Encoder, Decoder, Codec } from "../types"
import { createCodec, toBuffer } from "../utils"

export const BytesEnc =
  (nBytes: number): Encoder<Uint8Array> =>
  (bytes) =>
    bytes.length === nBytes ? bytes : bytes.slice(0, nBytes)

export const BytesDec = (nBytes: number): Decoder<Uint8Array> =>
  toBuffer((buffer) => {
    const len = nBytes !== Infinity ? nBytes : buffer.byteLength
    const value = new Uint8Array(buffer.buffer, 0, len)
    const result = new Uint8Array(len)
    result.forEach((_, idx) => {
      result[idx] = value[idx]
    })
    buffer.useBytes(len)
    return result
  })

export const Bytes = (nBytes: number): Codec<Uint8Array> =>
  createCodec(BytesEnc(nBytes), BytesDec(nBytes))
