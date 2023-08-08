import {
  Bytes,
  Codec,
  createCodec,
  createDecoder,
  Decoder,
  Encoder,
} from "scale-ts"
import { compactNumber } from "./compact"

export type OpaqueValue<T> = {
  length: number
  inner: () => T
}

const OpaqueDecoder = <T>(
  inner: Decoder<T>,
  len: Decoder<number> = compactNumber.dec,
): Decoder<OpaqueValue<T>> =>
  createDecoder((bytes) => {
    const length = len(bytes)
    const innerBytes = Bytes(length).dec(bytes)
    let _cachedValue: T | undefined

    return {
      length,
      inner: () => (_cachedValue = _cachedValue || inner(innerBytes)),
    }
  })

const OpaqueEncoder =
  <T>(
    inner: Encoder<T>,
    len: Encoder<number> = compactNumber.enc,
  ): Encoder<OpaqueValue<T>> =>
  (input) => {
    const lenBytes = len(input.length)

    const result = new Uint8Array(lenBytes.length + input.length)
    result.set(lenBytes, 0)
    result.set(inner(input.inner()), lenBytes.length)

    return result
  }

export const OpaqueCodec = <T>(
  inner: Codec<T>,
  len: Codec<number> = compactNumber,
): Codec<OpaqueValue<T>> =>
  createCodec(
    OpaqueEncoder(inner.enc, len.enc),
    OpaqueDecoder(inner.dec, len.dec),
  )

OpaqueCodec.enc = OpaqueEncoder
OpaqueCodec.dec = OpaqueDecoder
