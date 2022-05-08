import { Codec } from "../types"
import { enhanceCodec } from "../"
import { uint8 } from "./Uint"

export const bool: Codec<boolean> = enhanceCodec(
  uint8,
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
