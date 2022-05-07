import { Codec } from "../types.ts"
import { enhanceCodec } from "../index.ts"
import { uint } from "./uint.ts"

export const bool: Codec<boolean> = enhanceCodec(
  uint(8),
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
