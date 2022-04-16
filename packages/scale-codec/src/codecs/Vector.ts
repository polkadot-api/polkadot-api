import { mergeUint8 } from "@unstoppablejs/utils"
import { toInternalBytes } from "../internal"
import { createCodec } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { compact } from "./compact"

function VectorEnc<T>(inner: Encoder<T>): Encoder<Array<T>> {
  return (value: Array<any>) =>
    mergeUint8(compact.enc(value.length), ...value.map(inner))
}

function VectorDec<T>(getter: Decoder<T>): Decoder<Array<T>> {
  return toInternalBytes((bytes) => {
    let nElements = compact.dec(bytes)
    const result = new Array(nElements as number)

    for (let i = 0; i < nElements; i++) {
      const current = getter(bytes)
      result[i] = current
    }

    return result
  })
}

export function Vector<T>(inner: Codec<T>): Codec<Array<T>> {
  return createCodec(VectorEnc(inner[0]), VectorDec(inner[1]))
}

Vector.enc = VectorEnc
Vector.dec = VectorDec
