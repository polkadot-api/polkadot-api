import { createCodec } from "../"
import { toInternalBytes } from "../internal"
import { u8, u16, u32 } from "./fixed-width-ints"
import { Decoder, Encoder, Codec } from "../types"

const bytesToIntType = {
  [1]: u8[1],
  [2]: u16[1],
  [4]: u32[1],
} as const

const compactDec: Decoder<number | bigint> = toInternalBytes<number | bigint>(
  (bytes) => {
    let usedBytes = bytes.i
    const init = bytes[usedBytes]

    const kind = init & 3

    if (kind !== 3) {
      const nBytes = kind === 2 ? 4 : kind + 1
      return bytesToIntType[nBytes as 1 | 2 | 4](bytes) >>> 2
    }

    const nBytes = (init >>> 2) + 4
    const start = usedBytes + 1
    bytes.i += nBytes + 1

    let result = 0n
    for (let i = nBytes - 1; i >= 0; i--)
      result = (result << 8n) | BigInt(bytes[start + i])

    return result
  },
)

const compactEnc: Encoder<number | bigint> = (input) => {
  if (input < 0) {
    throw new Error(`Wrong Compat input (${input})`)
  }
  if (input < 1 << 6) {
    const temp = new Uint8Array(1)
    temp[0] = Number(input) << 2
    return temp
  }
  if (input < 1 << 14) {
    const temp = new Uint8Array(2)
    let pInput = (Number(input) << 2) + 1
    const dv = new DataView(temp.buffer)
    dv.setUint16(0, pInput, true)
    return temp
  }
  if (input < 1 << 30) {
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

export const compact: Codec<number | bigint> = createCodec(
  compactEnc,
  compactDec,
)
