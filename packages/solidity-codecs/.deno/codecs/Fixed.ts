import { Codec } from "../types.ts"
import { enhanceCodec } from "../utils.ts"

export interface Decimal<T extends number = number> {
  value: bigint
  decimals: T
}

export const Fixed = <D extends number>(
  baseCodec: Codec<bigint>,
  decimals: D,
) =>
  enhanceCodec<bigint, Decimal<D>>(
    baseCodec,
    (x) => x.value,
    (value) => ({ value, decimals }),
  )
