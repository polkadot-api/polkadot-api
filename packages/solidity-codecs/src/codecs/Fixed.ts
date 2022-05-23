import { Codec } from "../types"
import { enhanceCodec } from "../utils"

export interface Decimal<T extends number = number> {
  value: bigint
  decimals: T
}

export const Fixed = <D extends number>(
  baseCodec: Codec<bigint>,
  decimals: D,
) => {
  const baseSelector = baseCodec.s
  const eBaseCodec = Object.assign([], baseCodec)
  eBaseCodec.s =
    (baseSelector[0] === "u"
      ? "ufixed" + baseSelector.slice(4)
      : "fixed" + baseSelector.slice(3)) +
    "x" +
    decimals
  return enhanceCodec<bigint, Decimal<D>>(
    eBaseCodec,
    (x) => x.value,
    (value) => ({ value, decimals }),
  )
}
