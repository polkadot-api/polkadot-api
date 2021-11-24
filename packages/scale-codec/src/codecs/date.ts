import { Codec, Decoder, Encoder } from "../types"
import { createCodec, toInternalBytes } from "../utils"

const DateEnc = (nBits: 32 | 64): Encoder<Date> => {
  const method =
    nBits === 32 ? ("setUint32" as const) : ("setBigUint64" as const)
  const len = nBits / 8
  const fn: any = nBits === 32 ? (x: any) => x : BigInt

  return (input) => {
    const result = new Uint8Array(len)
    const dv = new DataView(result.buffer)
    ;(dv[method] as any)(0, fn(input.getTime()), true)
    return result
  }
}

const DateDec = (nBits: 32 | 64): Decoder<Date> => {
  const method =
    nBits === 32 ? ("getUint32" as const) : ("getBigUint64" as const)
  const len = nBits / 8

  return toInternalBytes((bytes) => {
    const result = new Date(
      Number(new DataView(bytes.buffer)[method](bytes.usedBytes, true)),
    )
    bytes.useBytes(len)
    return result
  })
}

const SDate = (nBits: 32 | 64): Codec<Date> =>
  createCodec(DateEnc(nBits), DateDec(nBits))

export const date32 = SDate(32)
export const date64 = SDate(64)
