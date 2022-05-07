import { Codec } from "../types"
import { enhanceCodec } from "../"
import { uint } from "./uint"

export const bool: Codec<boolean> = enhanceCodec(
  uint(8),
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
