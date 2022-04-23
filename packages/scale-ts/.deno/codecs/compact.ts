import { createCodec } from "../index.ts"
import { mergeUint8, toInternalBytes } from "../internal/index.ts"
import { u8, u16, u32, u64 } from "./fixed-width-ints.ts"
import { Decoder, Encoder, Codec } from "../types.ts"

const decoders = [u8[1], u16[1], u32[1]] as const
const compactDec: Decoder<number | bigint> = toInternalBytes<number | bigint>(
  (bytes) => {
    const init = bytes[bytes.i]

    const kind = init & 3
    if (kind < 3) return decoders[kind](bytes) >>> 2

    const nBytes = (init >>> 2) + 4
    bytes.i++

    let result = 0n

    const nU64 = (nBytes / 8) | 0
    let shift = 0n
    for (let i = 0; i < nU64; i++) {
      result = (u64[1](bytes) << shift) | result
      shift += 64n
    }

    let nReminders = nBytes % 8
    if (nReminders > 3) {
      result = (BigInt(u32[1](bytes)) << shift) | result
      shift += 32n
      nReminders -= 4
    }

    if (nReminders > 1) {
      result = (BigInt(u16[1](bytes)) << shift) | result
      shift += 16n
      nReminders -= 2
    }

    if (nReminders) result = (BigInt(u8[1](bytes)) << shift) | result

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

  if (bigValue >= MIN_U32) {
    buffers.push(u32[0](Number(bigValue & U32_MASK)))
    bigValue >>= 32n
  }

  let smValue = Number(bigValue)
  if (smValue >= MIN_U16) {
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
