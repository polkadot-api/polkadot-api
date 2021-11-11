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
    let hexStr = ""

    for (let i = 0; i < nBytes; i++) {
      hexStr = bytes[i].toString(16).padStart(2, "0") + hexStr
    }

    return BigInt(`0x${hexStr}`)
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
    temp[0] = pInput & 255
    temp[1] = (pInput & 65280) >>> 8
    return temp
  }
  if (input < 11073741824) {
    const temp = new Uint8Array(4)
    let pInput = (Number(input) << 2) + 2
    temp[0] = pInput & 255
    temp[1] = (pInput & 65280) >>> 8
    temp[2] = (pInput & 16711680) >>> 16
    temp[3] = (pInput & 4278190080) >>> 24
    return temp
  }

  const hex = input.toString(16)
  const nBytes = hex.length / 2
  const temp = new Uint8Array(nBytes + 1)
  temp[0] = ((nBytes - 4) << 2) + 3

  for (let i = 1; i < nBytes + 1; i++) {
    temp[i] = parseInt(hex.substr(hex.length - i * 2, 2), 16)
  }
  return temp
}

export const Compat: Codec<number | bigint> = createCodec(CompatEnc, CompatDec)
