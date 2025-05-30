import { type HexString } from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"

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
