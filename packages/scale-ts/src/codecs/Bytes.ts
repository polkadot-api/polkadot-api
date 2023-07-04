import { Encoder, Decoder, Codec } from "../types"
import { createCodec } from "../"
import { mergeUint8, toInternalBytes } from "../internal"
import { compact } from "./compact"

const BytesEnc = (nBytes?: number): Encoder<Uint8Array> =>
  nBytes === undefined
    ? (bytes) => mergeUint8(compact.enc(bytes.length), bytes)
    : (bytes) => (bytes.length === nBytes ? bytes : bytes.slice(0, nBytes))

const BytesDec = (nBytes?: number): Decoder<Uint8Array> =>
  toInternalBytes((bytes) => {
    const len =
      nBytes === undefined
        ? (compact.dec(bytes) as number)
        : nBytes !== Infinity
        ? nBytes
        : bytes.byteLength - bytes.i

    const result = new Uint8Array(bytes.buffer.slice(bytes.i, bytes.i + len))
    bytes.i += len
    return result
  })

export const Bytes = (nBytes?: number): Codec<Uint8Array> =>
  createCodec(BytesEnc(nBytes), BytesDec(nBytes))

Bytes.enc = BytesEnc
Bytes.dec = BytesDec
