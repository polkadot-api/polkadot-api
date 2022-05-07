import { Codec, Decimal } from "../types"
import { enhanceCodec } from "../utils"
import { Int } from "./Int"
import { Uint } from "./Uint"

const creator = (codec: (nBits: number) => Codec<bigint>) => {
  const cache: Map<number, Codec<Decimal>> = new Map()
  return (nBits: number, decimals: number): Codec<Decimal> => {
    const key = (decimals << 8) | nBits
    let cached = cache.get(key)
    if (cached) return cached

    cached = enhanceCodec(
      codec(nBits),
      (x) => x.value,
      (value) => ({ value, decimals }),
    )
    cache.set(key, cached)
    return cached
  }
}

export const Fixed = creator(Int)
export const Ufixed = creator(Uint)
