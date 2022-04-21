import { Codec } from "../types"
import { enhanceCodec } from "../"
import { u8 } from "./fixed-width-ints"

export const bool: Codec<boolean> = enhanceCodec(
  u8,
  (value: boolean) => (value ? 1 : 0),
  Boolean,
)
