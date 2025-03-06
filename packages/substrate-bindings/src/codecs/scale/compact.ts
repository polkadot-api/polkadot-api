import { compact, enhanceCodec } from "scale-ts"

export const compactNumber = enhanceCodec(compact, (v) => v, Number)
export const compactBn = enhanceCodec(compact, (v) => v, BigInt)
