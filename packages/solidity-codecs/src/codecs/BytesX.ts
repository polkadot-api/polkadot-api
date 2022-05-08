import { Encoder, Decoder, Codec } from "../types"
import { createCodec } from "../"
import { range32, toInternalBytes } from "../internal"

const bytesEnc =
  (nBytes: number): Encoder<Uint8Array> =>
  (bytes) => {
    if (bytes.length === nBytes && nBytes === 32) return bytes
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

export const [
  bytes1,
  bytes2,
  bytes3,
  bytes4,
  bytes5,
  bytes6,
  bytes7,
  bytes8,
  bytes9,
  bytes10,
  bytes11,
  bytes12,
  bytes13,
  bytes14,
  bytes15,
  bytes16,
  bytes17,
  bytes18,
  bytes19,
  bytes20,
  bytes21,
  bytes22,
  bytes23,
  bytes24,
  bytes25,
  bytes26,
  bytes27,
  bytes28,
  bytes29,
  bytes30,
  bytes31,
  bytes32,
] = range32.map(
  (nBytes: number): Codec<Uint8Array> =>
    createCodec(bytesEnc(nBytes), bytesDec(nBytes)),
)
