import { type HexString } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"

export const mergeUint8 = (inputs: Array<Uint8Array>): Uint8Array => {
  const len = inputs.length
  let totalLen = 0
  for (let i = 0; i < len; i++) totalLen += inputs[i].byteLength
  const result = new Uint8Array(totalLen)

  for (let idx = 0, at = 0; idx < len; idx++) {
    const current = inputs[idx]
    result.set(current, at)
    at += current.byteLength
  }

  return result
}

export const toBytes = (input: Uint8Array | HexString) =>
  typeof input === "string" ? fromHex(input) : input

export const compactTypeRefs = {
  null: "void" as const,
  u8: "compactU8" as const,
  u16: "compactU16" as const,
  u32: "compactU32" as const,
  u64: "compactU64" as const,
  u128: "compactU128" as const,
  u256: "compactU256" as const,
}
