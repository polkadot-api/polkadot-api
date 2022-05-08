import { Codec } from "../types.ts"
import { enhanceCodec } from "../index.ts"
import { uint8 } from "./Uint.ts"

export const bool: Codec<boolean> = enhanceCodec(
  uint8,
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
