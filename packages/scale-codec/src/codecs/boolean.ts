import { Codec } from "../types"
import { u8 } from "./u8"
import { enhanceCodec } from "../utils"

const booleanToNumber = (value: boolean) => (value ? 1 : 0)

export const boolean: Codec<boolean> = enhanceCodec(
  u8,
  booleanToNumber,
  Boolean,
)
