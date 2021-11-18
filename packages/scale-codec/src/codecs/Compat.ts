import { createCodec, decodeUInt, toBuffer } from "../utils"
import { Decoder, Encoder, Codec } from "../types"

export const CompatDec: Decoder<number | bigint> = toBuffer<number | bigint>(
  (buffer) => {
    const init = buffer[buffer.usedBytes()]

    const kind = init & 3

    if (kind !== 3) {
      const nBytes = kind === 2 ? 4 : kind + 1
      return decodeUInt(nBytes)(buffer) >>> 2
    }

    const nBytes = (init >>> 2) + 4
    const bytes = buffer.slice(buffer.usedBytes() + 1)
    buffer.useBytes(nBytes + 1)

    let result = 0n
    for (let i = nBytes - 1; i >= 0; i--)
      result = (result << 8n) | BigInt(bytes[i])

    return result
  },
)

export const CompatEnc: Encoder<number | bigint> = (input) => {
  if (input < 0) {
    throw new Error(`Wrong Compat input (${input})`)
  }
  if (input < 64) {
    const temp = new Uint8Array(1)
    temp[0] = Number(input) << 2
    return temp
  }
  if (input < 16384) {
    const temp = new Uint8Array(2)
    let pInput = (Number(input) << 2) + 1
    const dv = new DataView(temp.buffer)
    dv.setUint16(0, pInput, true)
    return temp
  }
  if (input < 11073741824) {
    const temp = new Uint8Array(4)
    let pInput = (Number(input) << 2) + 2
    const dv = new DataView(temp.buffer)
    dv.setUint32(0, pInput, true)
    return temp
  }

  const result: number[] = []
  let tmp = BigInt(input)
  while (tmp > 0) {
    result.push(Number(tmp))
    tmp >>= 8n
  }
  result.unshift(((result.length - 4) << 2) + 3)
  return new Uint8Array(result)
}

export const Compat: Codec<number | bigint> = createCodec(CompatEnc, CompatDec)
