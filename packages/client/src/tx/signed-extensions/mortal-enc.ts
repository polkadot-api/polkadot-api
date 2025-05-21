import { Bytes, enhanceEncoder, u16 } from "@polkadot-api/substrate-bindings"

function trailingZeroes(n: number) {
  let i = 0
  while (!(n & 1)) {
    i++
    n >>= 1
  }
  return i
}

function nextPower(n: number) {
  if ((n & (n - 1)) === 0) return n
  let count = 0
  while (n > 0) {
    n >>= 1
    count++
  }
  return 1 << count
}

export const mortal = enhanceEncoder(
  Bytes(2)[0],
  (value: { period: number; startAtBlock: number }) => {
    const period = Math.min(Math.max(nextPower(value.period), 4), 1 << 16)
    const phase = value.startAtBlock % period
    const factor = Math.max(period >> 12, 1)
    const left = Math.min(Math.max(trailingZeroes(period) - 1, 1), 15)
    const right = (phase / factor) << 4
    return u16[0](left | right)
  },
)
