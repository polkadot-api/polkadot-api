import { Encoder, Decoder, Codec } from "../types"
import { createCodec } from "../"
import { toInternalBytes } from "../internal"

const bytesEnc =
  (nBytes: number): Encoder<Uint8Array> =>
  (bytes) => {
    if (bytes.length === 32) return bytes
    const result = new Uint8Array(32)
    result.set(bytes.length === nBytes ? bytes : bytes.slice(0, nBytes))
    return result
  }

const bytesDec = (nBytes: number): Decoder<Uint8Array> =>
  toInternalBytes((bytes) => {
    const result = new Uint8Array(bytes.buffer, bytes.i, nBytes)
    bytes.i += 32
    return result
  })

export const bytes = (nBytes: number): Codec<Uint8Array> =>
  createCodec(bytesEnc(nBytes), bytesDec(nBytes))

bytes.enc = bytesEnc
bytes.dec = bytesDec
