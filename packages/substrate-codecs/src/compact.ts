import { Codec, compact } from "scale-ts"

export const compactNumber = compact as Codec<number>
export const compactBn = compact as Codec<bigint>
