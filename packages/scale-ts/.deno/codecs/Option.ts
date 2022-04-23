import { Decoder, Encoder, Codec } from "../types.ts"
import { toInternalBytes, mergeUint8 } from "../internal/index.ts"
import { createCodec } from "../utils.ts"
import { u8 } from "./fixed-width-ints.ts"
import { bool } from "./bool.ts"

const OptionDec = <T>(inner: Decoder<T>): Decoder<T | undefined | void> =>
  toInternalBytes<T | undefined>((bytes) => {
    const val = u8.dec(bytes)
    if (val === 0) return undefined

    return inner === (bool[1] as any)
      ? ((val === 1) as unknown as T)
      : inner(bytes)
  })

const OptionEnc =
  <T>(inner: Encoder<T>): Encoder<T | undefined | void> =>
  (value) => {
    const result = new Uint8Array(1)
    if (value === undefined) {
      result[0] = 0
      return result
    }

    result[0] = 1
    if (inner === (bool[0] as any)) {
      result[0] = value ? 1 : 2
      return result
    }

    return mergeUint8(result, inner(value))
  }

export const Option = <T>(inner: Codec<T>): Codec<T | undefined | void> =>
  createCodec(OptionEnc(inner[0]), OptionDec(inner[1]))

Option.enc = OptionEnc
Option.dec = OptionDec
