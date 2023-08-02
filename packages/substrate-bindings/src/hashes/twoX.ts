import { u64 } from "@unstoppablejs/substrate-codecs"
import { mergeUint8 } from "@unstoppablejs/utils"
import { Endomorphism } from "fp-ts/lib/Endomorphism"
import { xxh64 } from "./xxh64"

export const Twox128: Endomorphism<Uint8Array> = (input) => {
  const result = new Uint8Array(16)
  const dv = new DataView(result.buffer)

  dv.setBigUint64(0, xxh64(input), true)
  dv.setBigUint64(8, xxh64(input, 1n), true)

  return result
}

export const Twox256: Endomorphism<Uint8Array> = (input) => {
  const result = new Uint8Array(32)
  const dv = new DataView(result.buffer)

  dv.setBigUint64(0, xxh64(input), true)
  dv.setBigUint64(8, xxh64(input, 1n), true)
  dv.setBigUint64(16, xxh64(input, 2n), true)
  dv.setBigUint64(24, xxh64(input, 3n), true)

  return result
}

export const Twox64Concat: Endomorphism<Uint8Array> = (encoded) =>
  mergeUint8(u64.enc(xxh64(encoded)), encoded)
