import { toInternalBytes, mergeUint8 } from "../internal/index.ts"
import { createCodec } from "../utils.ts"
import { Codec, Decoder, Encoder } from "../types.ts"
import { uint } from "./Uint.ts"

const vectorEnc = <T>(inner: Encoder<T>, size?: number): Encoder<Array<T>> => {
  if (size! >= 0) {
    const encoder: Encoder<Array<T>> = (value) =>
      mergeUint8(...value.map(inner))
    encoder.dyn = inner.dyn
    return encoder
  }
  const encoder: Encoder<Array<T>> = (value) =>
    mergeUint8(uint[0](BigInt(value.length)), ...value.map(inner))
  encoder.dyn = true
  return encoder
}

const vectorDec = <T>(getter: Decoder<T>, size?: number): Decoder<Array<T>> => {
  const decoder = toInternalBytes((bytes) => {
    const nElements = size! >= 0 ? size! : Number(uint[1](bytes))
    const decoded = new Array(nElements)

    for (let i = 0; i < nElements; i++) {
      decoded[i] = getter(bytes)
    }

    return decoded
  })
  if (size == null) decoder.dyn = true
  return decoder
}

export const Vector = <T>(inner: Codec<T>, size?: number): Codec<Array<T>> => {
  const codec = createCodec(
    vectorEnc(inner[0], size),
    vectorDec(inner[1], size),
  )
  if (size == null) codec.dyn = true
  return codec
}
