import { base58 } from "@scure/base"
import { blake2b } from "@noble/hashes/blake2.js"

const SS58_PREFIX = new TextEncoder().encode("SS58PRE")
const CHECKSUM_LENGTH = 2

export type SS58String = string & { readonly __SS58String?: never }
export type SS58AddressInfo =
  | { isValid: false }
  | { isValid: true; ss58Format: number; publicKey: Uint8Array }

export const getSs58AddressInfo = (address: SS58String): SS58AddressInfo => {
  try {
    const decoded = base58.decode(address)
    const prefixBytes = decoded.subarray(0, decoded[0] & 0b0100_0000 ? 2 : 1)
    const publicKey = decoded.subarray(
      prefixBytes.length,
      decoded.length - CHECKSUM_LENGTH,
    )

    const checksum = decoded.subarray(prefixBytes.length + publicKey.length)
    const expectedChecksum = blake2b(
      Uint8Array.of(...SS58_PREFIX, ...prefixBytes, ...publicKey),
      {
        dkLen: 64,
      },
    ).subarray(0, CHECKSUM_LENGTH)

    const isChecksumValid =
      checksum[0] === expectedChecksum[0] && checksum[1] === expectedChecksum[1]

    if (!isChecksumValid) return { isValid: false }

    return {
      isValid: true,
      ss58Format: prefixBytesToNumber(prefixBytes),
      publicKey: publicKey.slice(),
    }
  } catch (_) {
    return { isValid: false }
  }
}

const prefixBytesToNumber = (bytes: Uint8Array) => {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return dv.byteLength === 1 ? dv.getUint8(0) : dv.getUint16(0)
}

const withSs58Cache = (fn: (publicKey: Uint8Array) => SS58String) => {
  let cache: Record<number, any> = {}
  let activityCount = 0
  let latestCount = 0
  const checkActivity = () => {
    if (activityCount === latestCount) {
      cache = {}
      activityCount = latestCount = 0
    } else {
      latestCount = activityCount
      setTimeout(checkActivity, 0)
    }
  }

  return (publicKey: Uint8Array): SS58String => {
    if (++activityCount === 1) checkActivity()

    let entry = cache
    const lastIdx = publicKey.length - 1
    for (let i = 0; i <= lastIdx; i++) entry = entry[publicKey[i]] ||= {}
    return (entry[publicKey[lastIdx]] ||= fn(publicKey))
  }
}

export const fromBufferToBase58 = (ss58Format: number) => {
  const prefixBytes =
    ss58Format < 64
      ? Uint8Array.of(ss58Format)
      : Uint8Array.of(
          ((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          (ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6),
        )

  return withSs58Cache((publicKey: Uint8Array): SS58String => {
    const checksum = blake2b(
      Uint8Array.of(...SS58_PREFIX, ...prefixBytes, ...publicKey),
      {
        dkLen: 64,
      },
    ).subarray(0, CHECKSUM_LENGTH)
    return base58.encode(
      Uint8Array.of(...prefixBytes, ...publicKey, ...checksum),
    )
  })
}
