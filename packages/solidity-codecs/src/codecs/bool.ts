import type { Codec } from "../types"
import { enhanceCodec } from "../utils"
import { uint8 } from "./Uint"

const base = Object.assign([], uint8)
base.s = "bool"

export const bool: Codec<boolean> = enhanceCodec(
  base,
  (value: boolean) => (value ? 1n : 0n),
  Boolean,
)
