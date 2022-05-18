import { mergeUint8 } from "@unstoppablejs/utils"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { uint } from "./Uint"

const vectorEnc = <T>(inner: Encoder<T>, size?: number): Encoder<Array<T>> => {
  const result: Encoder<Array<T>> = (value) => {
    const isNotFixed = size == null ? 1 : 0
    const actualSize = isNotFixed ? value.length : size!
    let data: Array<Uint8Array>
    if (inner.dyn) {
      data = new Array<Uint8Array>(actualSize * 2)
      let offset = actualSize * 32
      for (let i = 0; i < actualSize; i++) {
        const encoded = inner(value[i])
        data[i] = uint.enc(BigInt(offset))
        offset += encoded.byteLength
        data[i + actualSize] = encoded
      }
    } else {
      data = new Array<Uint8Array>(actualSize)
      for (let i = 0; i < actualSize; i++) data[i] = inner(value[i])
    }
    if (isNotFixed) data!.unshift(uint.enc(BigInt(value.length)))
    return mergeUint8(...data)
  }
  result.dyn = true
  return result
}

const vectorDec = <T>(getter: Decoder<T>, size?: number): Decoder<Array<T>> => {
  const decoder = toInternalBytes((bytes) => {
    const nElements = size! >= 0 ? size! : Number(uint[1](bytes))
    const decoded = new Array(nElements)

    if (getter.dyn) {
      const init = bytes.i
      let current = init
      for (let i = 0; i < nElements; i++) {
        bytes.i = current
        const offset = Number(uint.dec(bytes))
        current = bytes.i
        bytes.i = init + offset
        decoded[i] = getter(bytes)
      }
    } else {
      for (let i = 0; i < nElements; i++) {
        decoded[i] = getter(bytes)
      }
    }

    return decoded
  })
  decoder.dyn = true
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
