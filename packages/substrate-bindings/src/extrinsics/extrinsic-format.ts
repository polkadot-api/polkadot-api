import { enhanceCodec, u8 } from "scale-ts"

const TYPES = {
  bare: 0b00,
  0b00: "bare",
  general: 0b01,
  0b01: "general",
  signed: 0b10,
  0b10: "signed",
} as const

export type ExtrinsicFormat =
  | { version: 4; type: "bare" | "signed" }
  | { version: 5; type: "bare" | "general" }

export const extrinsicFormat = enhanceCodec<number, ExtrinsicFormat>(
  u8,
  ({ version, type }) => version + (TYPES[type] << 6),
  (v) => {
    const version = v & 0x3f // 0b0011_1111
    const type = v >> 6
    if (version === 4 && (type === TYPES.bare || type === TYPES.signed))
      return { version, type: TYPES[type] }
    if (version === 5 && (type === TYPES.bare || type === TYPES.general))
      return { version, type: TYPES[type] }
    throw new Error(`ExtrinsicFormat ${v} not valid`)
  },
)
