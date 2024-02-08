import { enhanceCodec, u8 } from "scale-ts"

export const char = enhanceCodec(
  u8,
  (str: string) => str.charCodeAt(0),
  String.fromCharCode,
)
