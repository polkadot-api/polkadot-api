import { toInternalBytes, mergeUint8 } from "../internal"
import { createCodec } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { uint } from "./uint"

const uint256 = uint(256)
const vectorEnc = <T>(inner: Encoder<T>, size?: number): Encoder<Array<T>> => {
  if (size! >= 0) return (value) => mergeUint8(...value.map(inner))
  const result: Encoder<Array<T>> = (value) =>
    mergeUint8(uint256.enc(BigInt(value.length)), ...value.map(inner))
  result.din = true
  return result
}

const vectorDec = <T>(getter: Decoder<T>, size?: number): Decoder<Array<T>> => {
  const result = toInternalBytes((bytes) => {
    const nElements = size! >= 0 ? size! : Number(uint256.dec(bytes))
    const result = new Array(nElements)

    for (let i = 0; i < nElements; i++) {
      result[i] = getter(bytes)
    }

    return result
  })
  if (size == null) result.din = true
  return result
}

export const vector = <T>(inner: Codec<T>, size?: number): Codec<Array<T>> => {
  const result = createCodec(
    vectorEnc(inner[0], size),
    vectorDec(inner[1], size),
  )
  if (size == null) result.din = true
  return result
}

vector.enc = vectorEnc
vector.dec = vectorDec
