import { Codec, Decoder, Encoder } from "../types"
import { createCodec, toBuffer } from "../utils"

export const SDateEnc = (nBits: 32 | 64): Encoder<Date> => {
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

export const SDateDec = (nBits: 32 | 64): Decoder<Date> => {
  const method =
    nBits === 32 ? ("getUint32" as const) : ("getBigUint64" as const)
  const len = nBits / 8

  return toBuffer((buffer) => {
    const result = new Date(
      Number(new DataView(buffer.buffer)[method](buffer.usedBytes(), true)),
    )
    buffer.useBytes(len)
    return result
  })
}

export const SDate = (nBits: 32 | 64): Codec<Date> =>
  createCodec(SDateEnc(nBits), SDateDec(nBits))
