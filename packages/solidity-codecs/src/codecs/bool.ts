import { Codec } from "../types"
import { enhanceCodec } from "../"
import { Uint } from "./Uint"

export const bool: Codec<boolean> = enhanceCodec(
  Uint(8),
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
