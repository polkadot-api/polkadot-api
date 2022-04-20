import { createCodec } from "../"
import { mergeUint8, toInternalBytes } from "../internal"
import { u8, u16, u32, u64 } from "./fixed-width-ints"
import { Decoder, Encoder, Codec } from "../types"

const decoders = [u8[1], u16[1], u32[1], u64[1]] as const
const compactDec: Decoder<number | bigint> = toInternalBytes<number | bigint>(
  (bytes) => {
    const usedBytes = bytes.i
    const init = bytes[usedBytes]

    const kind = init & 3
    if (kind !== 3) return (decoders[kind](bytes) as number) >>> 2

    const nBytes = (init >>> 2) + 4
    bytes.i++

    const nU64 = (nBytes / 8) | 0
    let nReminders = nBytes % 8
    const nU32 = (nReminders / 4) | 0
    nReminders %= 4
    const lengths = [nReminders % 2, (nReminders / 2) | 0, nU32, nU64]

    let result = 0n
    let nBits = 0n
    let inc = 4n
    for (let d = 0; d < 4; d++) {
      inc *= 2n
      const len = lengths[d]
      for (let i = 0; i < len; i++) {
        result = (BigInt(decoders[d](bytes)) << nBits) | result
        nBits += inc
      }
    }
    return result
  },
)

const MIN_U64 = 1n << 56n
const MIN_U32 = 1 << 24
const MIN_U16 = 256
const U32_MASK = 4294967295n

const SINGLE_BYTE_MODE_LIMIT = 1 << 6
const TWO_BYTE_MODE_LIMIT = 1 << 14
const FOUR_BYTE_MODE_LIMIT = 1 << 30
const compactEnc: Encoder<number | bigint> = (input) => {
  if (input < 0) throw new Error(`Wrong compact input (${input})`)

  const nInput = Number(input) << 2
  if (input < SINGLE_BYTE_MODE_LIMIT) return u8[0](nInput)
  if (input < TWO_BYTE_MODE_LIMIT) return u16[0](nInput | 1)
  if (input < FOUR_BYTE_MODE_LIMIT) return u32[0](nInput | 2)

  let buffers: Array<Uint8Array> = [new Uint8Array(1)]
  let bigValue = BigInt(input)
  while (bigValue >= MIN_U64) {
    buffers.push(u64[0](bigValue))
    bigValue >>= 64n
  }

  while (bigValue >= MIN_U32) {
    buffers.push(u32[0](Number(bigValue & U32_MASK)))
    bigValue >>= 32n
  }

  let smValue = Number(bigValue)
  while (smValue >= MIN_U16) {
    buffers.push(u16[0](smValue))
    smValue >>= 16
  }
  smValue && buffers.push(u8[0](smValue))

  const result = mergeUint8(...buffers)
  result[0] = ((result.length - 5) << 2) | 3
  return result
}

export const compact: Codec<number | bigint> = createCodec(
  compactEnc,
  compactDec,
)
