import { Bytes, enhanceCodec } from "scale-ts"
import { blake2b } from "@noble/hashes/blake2b"
import { decodeBase58, encodeBase58 } from "./base58"

const SS58_PREFIX = new Uint8Array(
  "SS58PRE".split("").map((x) => x.charCodeAt(0)),
)

const fromBufferToBase58 = (ss58Format: number = 42) => {
  const prefixedBytes =
    ss58Format < 64
      ? [ss58Format]
      : [
          ((ss58Format & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          (ss58Format >> 8) | ((ss58Format & 0b0000_0000_0000_0011) << 6),
        ]

  return (publicKey: Uint8Array) => {
    const prefixed = new Uint8Array(publicKey.byteLength + prefixedBytes.length)
    prefixed.set(new Uint8Array(prefixedBytes), 0)
    prefixed.set(publicKey, prefixedBytes.length)

    const hash = blake2b(new Uint8Array([...SS58_PREFIX, ...prefixed]), {
      dkLen: 64,
    }).subarray(
      0,
      publicKey.byteLength === 32 || publicKey.byteLength === 33 ? 2 : 1,
    )

    return encodeBase58(new Uint8Array([...prefixed, ...hash]))
  }
}

function fromBase58ToBuffer(address: string) {
  const decoded = decodeBase58(address)
  const ss58Length = decoded[0] & 0b0100_0000 ? 2 : 1
  const isPublicKey = [34 + ss58Length, 35 + ss58Length].includes(
    decoded.length,
  )
  const length = decoded.length - (isPublicKey ? 2 : 1)
  return decoded.slice(ss58Length, length)
}

export const AccountId = (ss58Format: number) =>
  enhanceCodec(Bytes(32), fromBase58ToBuffer, fromBufferToBase58(ss58Format))
