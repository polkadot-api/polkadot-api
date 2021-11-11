import { createCodec, toBuffer } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { CompatDec, CompatEnc } from "./Compat"
import { mergeUint8 } from "@unstoppablejs/utils"

export const VectorEnc =
  <T>(inner: Encoder<T>): Encoder<Array<T>> =>
  (value) =>
    mergeUint8(CompatEnc(value.length), ...value.map(inner))

export const VectorDec = <T>(getter: Decoder<T>): Decoder<Array<T>> =>
  toBuffer((buffer) => {
    let nElements = CompatDec(buffer)
    const result = new Array<T>(nElements as number)

    for (let i = 0; i < nElements; i++) {
      const current = getter(buffer)
      result[i] = current
    }

    return result
  })

export const Vector = <T>(inner: Codec<T>): Codec<Array<T>> =>
  createCodec(VectorEnc(inner[0]), VectorDec(inner[1]))
