import { Bytes, enhanceEncoder, u16 } from "@polkadot-api/substrate-bindings"

function trailingZeroes(n: number) {
  let i = 0
  while (!(n & 1)) {
    i++
    n >>= 1
  }
  return i
}

export const mortal = enhanceEncoder(
  Bytes(2)[0],
  (value: { period: number; phase: number }) => {
    const factor = Math.max(value.period >> 12, 1)
    const left = Math.min(Math.max(trailingZeroes(value.period) - 1, 1), 15)
    const right = (value.phase / factor) << 4
    return u16[0](left | right)
  },
)
