import { Codec } from "../types.ts"
import { enhanceCodec } from "../index.ts"
import { u8 } from "./fixed-width-ints.ts"

export const bool: Codec<boolean> = enhanceCodec(
  u8,
  (value: boolean) => (value ? 1 : 0),
  Boolean,
)
