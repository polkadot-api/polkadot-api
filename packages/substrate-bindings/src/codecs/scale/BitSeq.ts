import {
  Bytes,
  Codec,
  Decoder,
  Encoder,
  createCodec,
  createDecoder,
} from "scale-ts"
import { compactNumber } from "./compact"
import { mergeUint8 } from "@polkadot-api/utils"

export type BitSeq = Array<0 | 1>

const dec: (isLsb?: boolean) => Decoder<BitSeq> = (isLsb = true) =>
  createDecoder((data) => {
    const bitsLen = compactNumber.dec(data)
    const bytesLen = Math.ceil(bitsLen / 8)
    const bytes = Bytes(bytesLen).dec(data)

    const result = new Array<0 | 1>(bitsLen)
    let resultIdx = 0
    bytes.forEach((val) => {
      for (let i = 0; i < 8 && resultIdx < bitsLen; i++) {
        const actualIdx = isLsb ? i : 7 - i
        result[resultIdx++] = ((val >> actualIdx) & 1) as 1 | 0
      }
    })
    return result
  })

const enc: (isLsb?: boolean) => Encoder<BitSeq> =
  (isLsb = true) =>
  (input) => {
    const lenEncoded = compactNumber.enc(input.length)
    const nBytes = Math.ceil(input.length / 8)

    const bytes = new Uint8Array(nBytes)
    for (let byteIdx = 0; byteIdx < nBytes; byteIdx++) {
      let inputIdx = byteIdx * 8
      let byte = 0
      for (let i = 0; i < 8 && inputIdx < input.length; i++, inputIdx++)
        byte |= input[inputIdx] << (isLsb ? i : 7 - i)
      bytes[byteIdx] = byte
    }

    return mergeUint8([lenEncoded, bytes])
  }

export const BitSeq = (isLsb?: boolean): Codec<BitSeq> =>
  createCodec(enc(isLsb), dec(isLsb))

BitSeq.enc = enc
BitSeq.dec = dec
