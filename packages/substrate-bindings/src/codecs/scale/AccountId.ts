import { Bytes, enhanceCodec } from "scale-ts"
import { blake2b } from "@noble/hashes/blake2b"
import { base58 } from "@scure/base"

const SS58_PREFIX = new TextEncoder().encode("SS58PRE")

const CHECKSUM_LENGTH = 2

export type SS58String = string & { __SS58String?: unknown }

const fromBufferToBase58 = (ss58Format: number) => {
  const prefixBytes =
    ss58Format < 64
      ? Uint8Array.of(ss58Format)
      : Uint8Array.of(
          ((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          (ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6),
        )
  return (publicKey: Uint8Array): SS58String => {
    const checksum = blake2b(
      Uint8Array.of(...SS58_PREFIX, ...prefixBytes, ...publicKey),
      {
        dkLen: 64,
      },
    ).subarray(0, CHECKSUM_LENGTH)
    return base58.encode(
      Uint8Array.of(...prefixBytes, ...publicKey, ...checksum),
    )
  }
}

function fromBase58ToBuffer(nBytes: number, ss58Format: number) {
  return (address: SS58String) => {
    const decoded = base58.decode(address)
    const prefixBytes = decoded.subarray(0, decoded[0] & 0b0100_0000 ? 2 : 1)
    const publicKey = decoded.subarray(
      prefixBytes.length,
      decoded.length - CHECKSUM_LENGTH,
    )
    if (publicKey.length !== nBytes)
      throw new Error("Invalid public key length")
    const checksum = decoded.subarray(prefixBytes.length + publicKey.length)
    const expectedChecksum = blake2b(
      Uint8Array.of(...SS58_PREFIX, ...prefixBytes, ...publicKey),
      {
        dkLen: 64,
      },
    ).subarray(0, CHECKSUM_LENGTH)
    if (
      checksum[0] !== expectedChecksum[0] ||
      checksum[1] !== expectedChecksum[1]
    )
      throw new Error("Invalid checksum")

    if (prefixBytesToNumber(prefixBytes) != ss58Format)
      throw new Error("Invalid SS58 prefix")

    return publicKey.slice()
  }
}

export const AccountId = (ss58Format: number = 42, nBytes: 32 | 33 = 32) =>
  enhanceCodec(
    Bytes(nBytes),
    fromBase58ToBuffer(nBytes, ss58Format),
    fromBufferToBase58(ss58Format),
  )

const prefixBytesToNumber = (bytes: Uint8Array) => {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return dv.byteLength === 1 ? dv.getUint8(0) : dv.getUint16(0)
}
