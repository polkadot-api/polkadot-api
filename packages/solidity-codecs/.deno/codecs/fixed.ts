import { Codec, Fixed } from "../types.ts"
import { enhanceCodec } from "../utils.ts"
import { int } from "./int.ts"
import { uint } from "./uint.ts"

const creator = (codec: (nBits: number) => Codec<bigint>) => {
  const cache: Map<number, Codec<Fixed>> = new Map()
  return (nBits: number, decimals: number): Codec<Fixed> => {
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

export const fixed = creator(int)
export const ufixed = creator(uint)
