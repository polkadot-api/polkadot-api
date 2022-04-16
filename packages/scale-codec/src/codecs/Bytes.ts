import { Encoder, Decoder, Codec } from "../types"
import { createCodec } from "../"
import { toInternalBytes } from "../internal"

const BytesEnc =
  (nBytes: number): Encoder<Uint8Array> =>
  (bytes) =>
    bytes.length === nBytes ? bytes : bytes.slice(0, nBytes)

const BytesDec = (nBytes: number): Decoder<Uint8Array> =>
  toInternalBytes((bytes) => {
    const nUsedBytes = bytes.usedBytes
    const len = nBytes !== Infinity ? nBytes : bytes.byteLength - nUsedBytes
    const result = bytes.slice(nUsedBytes, nUsedBytes + len)
    bytes.useBytes(len)
    return new Uint8Array(result.buffer)
  })

export const Bytes = (nBytes: number): Codec<Uint8Array> =>
  createCodec(BytesEnc(nBytes), BytesDec(nBytes))

Bytes.enc = BytesEnc
Bytes.dec = BytesDec
