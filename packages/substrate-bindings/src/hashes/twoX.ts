import { mergeUint8 } from "@polkadot-api/utils"
import { u64 } from "scale-ts"
import { h64 } from "./h64"

export const Twox128 = (input: Uint8Array): Uint8Array => {
  const result = new Uint8Array(16)
  const dv = new DataView(result.buffer)

  dv.setBigUint64(0, h64(input), true)
  dv.setBigUint64(8, h64(input, 1n), true)

  return result
}

export const Twox256 = (input: Uint8Array): Uint8Array => {
  const result = new Uint8Array(32)
  const dv = new DataView(result.buffer)

  dv.setBigUint64(0, h64(input), true)
  dv.setBigUint64(8, h64(input, 1n), true)
  dv.setBigUint64(16, h64(input, 2n), true)
  dv.setBigUint64(24, h64(input, 3n), true)

  return result
}

export const Twox64Concat = (encoded: Uint8Array): Uint8Array =>
  mergeUint8(u64.enc(h64(encoded)), encoded)
