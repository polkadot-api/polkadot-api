import type { Codec } from "../types"

export const createCodec = <T>(
  encoder: (value: T) => Uint8Array,
  decoder: (value: Uint8Array) => T,
  selector: string,
): Codec<T> => {
  ;(encoder as any).s = selector
  ;(decoder as any).s = selector
  const result = [encoder, decoder] as any
  result.enc = encoder
  result.dec = decoder
  result.s = selector
  return result
}
